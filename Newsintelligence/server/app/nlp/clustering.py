"""
Sentence embeddings + story clustering.

Part 1 (EmbeddingGenerator): embeds title + summary + clean_content for
each processed article using Sentence-Transformers. Embeddings are
computed in memory only and never persisted to MongoDB — regenerating
them per run keeps the storage footprint small at the cost of some
recompute time (see Part 9 performance notes in the module docstring
of `clustering_service.py`).

Part 2 (ClusteringEngine): groups articles into topic clusters. Prefers
HDBSCAN (density-based, no need to pre-specify cluster count, and
naturally produces a "not similar enough to anything" bucket via noise
points). Falls back to scikit-learn's AgglomerativeClustering with a
cosine-distance threshold if hdbscan isn't installed.

Because embeddings aren't persisted, clustering re-runs over the full
article set each time. Cluster *identity* is kept stable across runs by
majority-voting each newly-formed cluster's articles against whatever
`cluster_id` they were previously assigned (if any) — a cluster keeps
its ID as long as most of its members did last run; otherwise it's
treated as a new cluster with a fresh ID. This gives the required
behavior ("new articles join an existing cluster if similar enough,
otherwise start a new one") without needing an online/incremental
clustering algorithm.
"""

from __future__ import annotations

import uuid
from collections import Counter
from dataclasses import dataclass, field

import numpy as np

from app.utils.logger import get_logger

logger = get_logger(__name__)

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

# Cosine similarity below which a lone article becomes its own new cluster
# rather than being force-joined to the nearest existing one.
NEW_CLUSTER_SIMILARITY_THRESHOLD = 0.55

# HDBSCAN: minimum articles to form a cluster. Below this, points are
# noise and each becomes its own singleton cluster.
HDBSCAN_MIN_CLUSTER_SIZE = 2

NOISE_LABEL = -1


@dataclass
class ClusterAssignment:
    """Clustering output for a single article."""

    cluster_id: str
    cluster_size: int
    cluster_score: float  # this article's cosine similarity to its cluster centroid


@dataclass
class ClusterInfo:
    """Aggregate info about one cluster, used by topic naming / trending."""

    cluster_id: str
    article_urls: list[str] = field(default_factory=list)
    centroid: np.ndarray | None = None


class EmbeddingGenerator:
    """Generates sentence embeddings for articles using Sentence-Transformers."""

    _model = None
    _load_attempted = False

    def _get_model(self):
        cls = EmbeddingGenerator
        if cls._model is not None:
            return cls._model
        if cls._load_attempted:
            return None

        cls._load_attempted = True
        try:
            from sentence_transformers import SentenceTransformer

            logger.info("Loading embedding model '%s'...", EMBEDDING_MODEL_NAME)
            cls._model = SentenceTransformer(EMBEDDING_MODEL_NAME)
            logger.info("Embedding model loaded successfully.")
        except Exception as exc:
            logger.error(
                "Failed to load embedding model '%s': %s. "
                "Clustering will be skipped for this run.",
                EMBEDDING_MODEL_NAME,
                exc,
            )
        return cls._model

    @staticmethod
    def _build_text(article: dict) -> str:
        """Combine title + summary + clean_content into one embedding input."""
        parts = [
            article.get("title") or "",
            article.get("summary") or "",
            (article.get("clean_content") or "")[:2000],  # cap for speed
        ]
        return " ".join(p for p in parts if p).strip()

    def generate(self, articles: list[dict]) -> np.ndarray | None:
        """Generate one embedding vector per article, in input order.

        Returns None if the model couldn't be loaded (caller should skip
        clustering for this run rather than crash).
        """
        model = self._get_model()
        if model is None:
            return None
        if not articles:
            return np.empty((0, 0))

        texts = [self._build_text(a) for a in articles]
        try:
            embeddings = model.encode(
                texts, show_progress_bar=False, normalize_embeddings=True
            )
        except Exception as exc:
            logger.error("Embedding generation failed: %s", exc)
            return None

        logger.info("Embeddings generated for %d article(s).", len(articles))
        return np.asarray(embeddings)


class ClusteringEngine:
    """Groups articles into topic clusters from their embeddings."""

    def _cluster_with_hdbscan(self, embeddings: np.ndarray) -> np.ndarray | None:
        """Preferred clustering path. Returns integer labels, or None if
        hdbscan isn't installed / clustering fails."""
        try:
            import hdbscan
        except ImportError:
            return None

        try:
            clusterer = hdbscan.HDBSCAN(
                min_cluster_size=HDBSCAN_MIN_CLUSTER_SIZE,
                metric="euclidean",  # embeddings are normalized, so euclidean ~ cosine
            )
            labels = clusterer.fit_predict(embeddings)
            logger.info("Clustered with HDBSCAN.")
            return labels
        except Exception as exc:
            logger.warning("HDBSCAN clustering failed, falling back: %s", exc)
            return None

    def _cluster_with_agglomerative(self, embeddings: np.ndarray) -> np.ndarray:
        """Fallback clustering path using scikit-learn."""
        from sklearn.cluster import AgglomerativeClustering

        n = len(embeddings)
        if n < 2:
            return np.zeros(n, dtype=int)

        distance_threshold = 1.0 - NEW_CLUSTER_SIMILARITY_THRESHOLD
        clusterer = AgglomerativeClustering(
            n_clusters=None,
            metric="cosine",
            linkage="average",
            distance_threshold=distance_threshold,
        )
        labels = clusterer.fit_predict(embeddings)
        logger.info("Clustered with AgglomerativeClustering (fallback).")
        return labels

    def cluster(self, embeddings: np.ndarray) -> np.ndarray:
        """Return integer cluster labels for each embedding (-1 = noise,
        only possible via the HDBSCAN path)."""
        labels = self._cluster_with_hdbscan(embeddings)
        if labels is None:
            labels = self._cluster_with_agglomerative(embeddings)
        return labels

    @staticmethod
    def _centroid(vectors: np.ndarray) -> np.ndarray:
        """Mean embedding, re-normalized to unit length."""
        centroid = vectors.mean(axis=0)
        norm = np.linalg.norm(centroid)
        return centroid / norm if norm > 0 else centroid

    def assign_stable_cluster_ids(
        self,
        articles: list[dict],
        labels: np.ndarray,
        embeddings: np.ndarray,
    ) -> dict[str, ClusterAssignment]:
        """Turn raw cluster labels into stable ClusterAssignments.

        Noise points (-1) each become their own singleton cluster.
        Cluster identity is preserved across runs by majority vote
        against each article's previous `cluster_id`, if it had one.
        """
        results: dict[str, ClusterAssignment] = {}

        # Give every noise point its own unique label so it forms a
        # singleton "new cluster" rather than being lumped together.
        working_labels = list(labels)
        next_synthetic_label = int(max(labels, default=-1)) + 1
        for i, label in enumerate(working_labels):
            if label == NOISE_LABEL:
                working_labels[i] = next_synthetic_label
                next_synthetic_label += 1

        # Group article indices by raw (post-noise-split) label.
        groups: dict[int, list[int]] = {}
        for idx, label in enumerate(working_labels):
            groups.setdefault(label, []).append(idx)

        for label, indices in groups.items():
            member_urls = [articles[i]["article_url"] for i in indices]
            member_embeddings = embeddings[indices]
            centroid = self._centroid(member_embeddings)

            # Stable ID: reuse the most common previous cluster_id among
            # this group's members, if any of them had one.
            previous_ids = [
                articles[i].get("cluster_id")
                for i in indices
                if articles[i].get("cluster_id")
            ]
            if previous_ids:
                stable_id = Counter(previous_ids).most_common(1)[0][0]
            else:
                stable_id = str(uuid.uuid4())
                logger.info(
                    "New cluster created (%d article(s)): %s", len(indices), stable_id
                )

            for i in indices:
                similarity = float(np.dot(embeddings[i], centroid))
                results[articles[i]["article_url"]] = ClusterAssignment(
                    cluster_id=stable_id,
                    cluster_size=len(indices),
                    cluster_score=round(similarity, 4),
                )

            logger.info(
                "Cluster %s: %d article(s), avg cohesion %.3f",
                stable_id,
                len(indices),
                float(
                    np.mean(
                        [
                            np.dot(embeddings[i], centroid)
                            for i in indices
                        ]
                    )
                ),
            )

        return results

    def build_cluster_index(
        self, articles: list[dict], assignments: dict[str, ClusterAssignment], embeddings: np.ndarray
    ) -> dict[str, ClusterInfo]:
        """Build a cluster_id -> ClusterInfo index (members + centroid),
        used by related-story lookup and topic naming."""
        url_to_idx = {a["article_url"]: i for i, a in enumerate(articles)}
        index: dict[str, ClusterInfo] = {}

        for url, assignment in assignments.items():
            info = index.setdefault(assignment.cluster_id, ClusterInfo(cluster_id=assignment.cluster_id))
            info.article_urls.append(url)

        for info in index.values():
            idxs = [url_to_idx[u] for u in info.article_urls]
            info.centroid = self._centroid(embeddings[idxs])

        return index

    def find_related_articles(
        self,
        article: dict,
        cluster_info: ClusterInfo,
        articles: list[dict],
        embeddings: np.ndarray,
        top_n: int = 5,
    ) -> list[dict]:
        """Return the top_n most similar other articles in the same cluster."""
        url_to_idx = {a["article_url"]: i for i, a in enumerate(articles)}
        self_url = article["article_url"]
        self_idx = url_to_idx[self_url]
        self_vector = embeddings[self_idx]

        scored: list[tuple[float, dict]] = []
        for other_url in cluster_info.article_urls:
            if other_url == self_url:
                continue
            other_idx = url_to_idx[other_url]
            similarity = float(np.dot(self_vector, embeddings[other_idx]))
            other_article = articles[other_idx]
            scored.append(
                (
                    similarity,
                    {
                        "article_id": str(other_article.get("_id", "")),
                        "title": other_article.get("title", ""),
                        "similarity_score": round(similarity, 4),
                    },
                )
            )

        scored.sort(key=lambda pair: pair[0], reverse=True)
        return [entry for _score, entry in scored[:top_n]]
