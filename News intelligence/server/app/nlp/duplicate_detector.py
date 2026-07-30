"""
Duplicate detection.

Three levels, cheapest first:
  1. Exact URL match
  2. Exact (normalized) title match
  3. Near-duplicate detection via TF-IDF + cosine similarity (>90% -> duplicate)

Operates over a batch of articles, since near-duplicate detection is
inherently a pairwise comparison. Returns per-article results that
`processor.py` writes back to MongoDB as `is_duplicate`, `duplicate_of`,
and `similarity_score`.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.logger import get_logger

logger = get_logger(__name__)

NEAR_DUPLICATE_THRESHOLD = 0.90


@dataclass
class DuplicateResult:
    """Duplicate-detection outcome for a single article."""

    is_duplicate: bool = False
    duplicate_of: Optional[str] = None  # article_url of the kept original
    similarity_score: float = 0.0
    method: Optional[str] = None  # "url" | "title" | "content" | None


def _normalize_title(title: str) -> str:
    """Lowercase and strip punctuation/whitespace for exact-title matching."""
    if not title:
        return ""
    normalized = re.sub(r"[^\w\s]", "", title.lower())
    return re.sub(r"\s+", " ", normalized).strip()


class DuplicateDetector:
    """Detects exact and near-duplicate articles within a batch."""

    def __init__(self, similarity_threshold: float = NEAR_DUPLICATE_THRESHOLD) -> None:
        self.similarity_threshold = similarity_threshold

    def detect(self, articles: list[dict]) -> dict[str, DuplicateResult]:
        """Run all three duplicate-detection levels over a batch of articles.

        Args:
            articles: list of dicts, each with at least `article_url`,
                `title`, and `clean_content` (or `content` as fallback).

        Returns:
            Mapping of article_url -> DuplicateResult for every article
            in the batch (including non-duplicates, marked False).
        """
        results: dict[str, DuplicateResult] = {
            a["article_url"]: DuplicateResult() for a in articles if a.get("article_url")
        }

        self._detect_url_duplicates(articles, results)
        self._detect_title_duplicates(articles, results)
        self._detect_near_duplicates(articles, results)

        duplicate_count = sum(1 for r in results.values() if r.is_duplicate)
        logger.info(
            "Duplicate detection complete: %d of %d articles flagged as duplicates.",
            duplicate_count,
            len(articles),
        )
        return results

    def _detect_url_duplicates(
        self, articles: list[dict], results: dict[str, DuplicateResult]
    ) -> None:
        """Level 1: flag articles sharing the exact same URL, keeping the first seen."""
        seen: dict[str, str] = {}
        for article in articles:
            url = article.get("article_url")
            if not url:
                continue
            if url in seen:
                results[url] = DuplicateResult(
                    is_duplicate=True,
                    duplicate_of=seen[url],
                    similarity_score=1.0,
                    method="url",
                )
                logger.info("Duplicate detected (URL): %s", url)
            else:
                seen[url] = url

    def _detect_title_duplicates(
        self, articles: list[dict], results: dict[str, DuplicateResult]
    ) -> None:
        """Level 2: flag articles with an exact normalized-title match to an
        already-kept (non-duplicate) article."""
        seen_titles: dict[str, str] = {}
        for article in articles:
            url = article.get("article_url")
            if not url or results.get(url, DuplicateResult()).is_duplicate:
                continue  # already caught at Level 1

            normalized = _normalize_title(article.get("title", ""))
            if not normalized:
                continue

            if normalized in seen_titles:
                original_url = seen_titles[normalized]
                results[url] = DuplicateResult(
                    is_duplicate=True,
                    duplicate_of=original_url,
                    similarity_score=1.0,
                    method="title",
                )
                logger.info(
                    "Duplicate detected (title): %s (matches %s)", url, original_url
                )
            else:
                seen_titles[normalized] = url

    def _detect_near_duplicates(
        self, articles: list[dict], results: dict[str, DuplicateResult]
    ) -> None:
        """Level 3: TF-IDF + cosine similarity over remaining (non-duplicate)
        articles' content. Flags anything above `similarity_threshold`
        against an earlier, still-kept article."""
        candidates = [
            a
            for a in articles
            if a.get("article_url")
            and not results.get(a["article_url"], DuplicateResult()).is_duplicate
            and (a.get("clean_content") or a.get("content"))
        ]

        if len(candidates) < 2:
            return

        texts = [c.get("clean_content") or c.get("content") or "" for c in candidates]
        urls = [c["article_url"] for c in candidates]

        try:
            vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
            tfidf_matrix = vectorizer.fit_transform(texts)
            similarity_matrix = cosine_similarity(tfidf_matrix)
        except ValueError as exc:
            # Can happen if all documents are empty after stopword removal.
            logger.warning("TF-IDF near-duplicate detection skipped: %s", exc)
            return

        kept_indices: list[int] = []
        for i in range(len(urls)):
            if results[urls[i]].is_duplicate:
                continue

            best_match_idx: Optional[int] = None
            best_score = 0.0
            for j in kept_indices:
                score = float(similarity_matrix[i][j])
                if score > best_score:
                    best_score = score
                    best_match_idx = j

            if best_match_idx is not None and best_score >= self.similarity_threshold:
                results[urls[i]] = DuplicateResult(
                    is_duplicate=True,
                    duplicate_of=urls[best_match_idx],
                    similarity_score=round(best_score, 4),
                    method="content",
                )
                logger.info(
                    "Duplicate detected (content, %.1f%% similar): %s (matches %s)",
                    best_score * 100,
                    urls[i],
                    urls[best_match_idx],
                )
            else:
                kept_indices.append(i)
