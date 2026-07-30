"""
Clustering orchestration service.

Ties together `clustering.py`, `topic_generator.py`, and the trending
half of `analytics.py`:

    fetch processed articles
      -> generate embeddings (batch)
      -> cluster
      -> generate a topic name per cluster
      -> find each article's related stories within its cluster
      -> compute a trending score per cluster
      -> write cluster_id / topic_name / cluster_size / cluster_score /
         related_articles / trending_score back to MongoDB

Performance notes (Part 9):
  - Embeddings are generated in one batched `model.encode()` call, not
    per-article, and the embedding model itself is a process-wide
    singleton (loaded once — see `EmbeddingGenerator`).
  - Only articles that have finished the Day 2 pipeline and aren't
    marked as duplicates are pulled in (`processed_at` exists,
    `is_duplicate` is False) — duplicates never entered clustering.
  - `cluster_id` and `processed_at` are indexed so the fetch and the
    later `/topics`, `/trending`, `/analytics` queries stay fast as the
    collection grows to the "thousands of articles" scale this is
    designed for.
"""

from __future__ import annotations

import time

from pymongo import UpdateOne
from pymongo.errors import PyMongoError

from app.database.connection import get_mongo_connection
from app.nlp.analytics import TrendingCalculator
from app.nlp.clustering import ClusteringEngine, EmbeddingGenerator
from app.nlp.topic_generator import generate_topic_name
from app.utils.logger import get_logger

logger = get_logger(__name__)

CLUSTERING_FETCH_LIMIT = 5000  # safety cap for a single run


class ClusteringService:
    """Runs the full embed -> cluster -> name -> link -> score -> store pipeline."""

    def __init__(self) -> None:
        self.connection = get_mongo_connection()
        self.embedding_generator = EmbeddingGenerator()
        self.clustering_engine = ClusteringEngine()
        self.trending_calculator = TrendingCalculator()
        self._ensure_indexes()

    def _ensure_indexes(self) -> None:
        """Index fields used heavily by clustering fetches and topic/trending queries."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.warning("Skipping clustering index creation: no MongoDB connection.")
            return
        try:
            collection.create_index("cluster_id")
            collection.create_index("processed_at")
            collection.create_index("trending_score")
        except PyMongoError as exc:
            logger.error("Failed to create clustering indexes: %s", exc)

    def _fetch_clusterable_articles(self) -> list[dict]:
        """Fetch processed, non-duplicate articles eligible for clustering."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch articles for clustering: no MongoDB connection.")
            return []

        try:
            cursor = collection.find(
                {"processed_at": {"$exists": True}, "is_duplicate": False}
            ).limit(CLUSTERING_FETCH_LIMIT)
            return list(cursor)
        except PyMongoError as exc:
            logger.error("Failed to fetch clusterable articles: %s", exc)
            return []

    def run_clustering(self) -> dict:
        """Run the full clustering pipeline once. Returns a summary dict."""
        start_time = time.monotonic()
        articles = self._fetch_clusterable_articles()

        if len(articles) < 2:
            logger.info(
                "Not enough processed articles to cluster (%d found); skipping run.",
                len(articles),
            )
            return {"articles": len(articles), "clusters": 0, "updated": 0}

        embeddings = self.embedding_generator.generate(articles)
        if embeddings is None or embeddings.shape[0] == 0:
            logger.error("Embedding generation unavailable; aborting clustering run.")
            return {"articles": len(articles), "clusters": 0, "updated": 0}

        labels = self.clustering_engine.cluster(embeddings)
        assignments = self.clustering_engine.assign_stable_cluster_ids(
            articles, labels, embeddings
        )
        cluster_index = self.clustering_engine.build_cluster_index(
            articles, assignments, embeddings
        )

        # Topic names: one per cluster, generated from its member articles.
        url_to_article = {a["article_url"]: a for a in articles}
        topic_names: dict[str, str] = {}
        for cluster_id, info in cluster_index.items():
            members = [url_to_article[u] for u in info.article_urls]
            topic_names[cluster_id] = generate_topic_name(members)

        # Trending scores: one per cluster, from recency/size/frequency/sentiment.
        cluster_articles_by_id = {
            cluster_id: [url_to_article[u] for u in info.article_urls]
            for cluster_id, info in cluster_index.items()
        }
        trending_scores = self.trending_calculator.compute_cluster_scores(
            cluster_articles_by_id
        )

        # Related stories + final update documents, per article.
        updates: dict[str, dict] = {}
        for article in articles:
            url = article["article_url"]
            assignment = assignments[url]
            cluster_info = cluster_index[assignment.cluster_id]

            related = self.clustering_engine.find_related_articles(
                article, cluster_info, articles, embeddings
            )

            updates[url] = {
                "cluster_id": assignment.cluster_id,
                "cluster_size": assignment.cluster_size,
                "cluster_score": assignment.cluster_score,
                "topic_name": topic_names[assignment.cluster_id],
                "related_articles": related,
                "trending_score": trending_scores.get(assignment.cluster_id, 0.0),
            }

        updated_count = self._persist_updates(updates)

        elapsed = time.monotonic() - start_time
        logger.info(
            "Clustering run complete: %d articles -> %d clusters, %d updated (%.2fs).",
            len(articles),
            len(cluster_index),
            updated_count,
            elapsed,
        )
        return {
            "articles": len(articles),
            "clusters": len(cluster_index),
            "updated": updated_count,
        }

    def _persist_updates(self, updates: dict[str, dict]) -> int:
        """Bulk-write cluster/topic fields back to MongoDB via $set."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot persist clustering updates: no MongoDB connection.")
            return 0
        if not updates:
            return 0

        operations = [
            UpdateOne({"article_url": url}, {"$set": fields})
            for url, fields in updates.items()
        ]
        try:
            result = collection.bulk_write(operations, ordered=False)
            return result.modified_count
        except PyMongoError as exc:
            logger.error("Bulk write of clustering updates failed: %s", exc)
            return 0
