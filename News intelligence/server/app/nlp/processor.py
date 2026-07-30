"""
NLP processing pipeline orchestrator.

Workflow per batch of articles:

    Article
      -> Clean Content
      -> Duplicate Detection (batch-level, needs all articles at once)
      -> [for each non-duplicate article:]
           Generate Summary
           Sentiment Analysis
           Keyword Extraction
           Named Entity Recognition
      -> Build MongoDB update document

Any single stage failing for a single article is logged and the
pipeline continues with the remaining stages / remaining articles —
one bad article should never abort a batch run.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.nlp.cleaner import ArticleCleaner
from app.nlp.duplicate_detector import DuplicateDetector, DuplicateResult
from app.nlp.entities import EntityExtractor
from app.nlp.keywords import KeywordExtractor
from app.nlp.sentiment import SentimentAnalyzer
from app.nlp.summarizer import ArticleSummarizer
from app.utils.logger import get_logger

logger = get_logger(__name__)


@dataclass
class ProcessingSummary:
    """Aggregate stats for a batch processing run."""

    total: int = 0
    processed: int = 0
    duplicates: int = 0
    skipped_short: int = 0
    failed: int = 0
    errors: list[str] = field(default_factory=list)


class ArticleProcessor:
    """Runs the full cleaning -> dedup -> NLP enrichment pipeline."""

    def __init__(self) -> None:
        self.cleaner = ArticleCleaner()
        self.duplicate_detector = DuplicateDetector()
        self.summarizer = ArticleSummarizer()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.keyword_extractor = KeywordExtractor()
        self.entity_extractor = EntityExtractor()

    def process_batch(self, articles: list[dict]) -> dict[str, dict]:
        """Process a batch of raw article documents end to end.

        Args:
            articles: raw MongoDB article documents (must include
                `article_url`, `title`, `content`).

        Returns:
            Mapping of article_url -> MongoDB update dict (the fields
            from Part 8 of the spec). Callers are responsible for
            writing these back with `$set`.
        """
        summary = ProcessingSummary(total=len(articles))
        updates: dict[str, dict] = {}

        # Stage 1: clean every article first (dedup needs clean_content).
        cleaned_articles = self._clean_batch(articles, summary)

        # Stage 2: duplicate detection needs the whole batch at once.
        dup_results = self.duplicate_detector.detect(cleaned_articles)

        # Stage 3: per-article NLP enrichment, skipped for duplicates.
        for article in cleaned_articles:
            url = article.get("article_url")
            if not url:
                continue

            dup_result = dup_results.get(url, DuplicateResult())
            if dup_result.is_duplicate:
                summary.duplicates += 1
                updates[url] = self._duplicate_update(dup_result)
                continue

            try:
                updates[url] = self._enrich_article(article, dup_result)
                summary.processed += 1
            except Exception as exc:
                summary.failed += 1
                summary.errors.append(f"{url}: {exc}")
                logger.error("Unexpected pipeline failure for %s: %s", url, exc)

        logger.info(
            "Pipeline run complete. Total: %d | Processed: %d | Duplicates: %d | "
            "Skipped (too short): %d | Failed: %d",
            summary.total,
            summary.processed,
            summary.duplicates,
            summary.skipped_short,
            summary.failed,
        )
        return updates

    def _clean_batch(
        self, articles: list[dict], summary: ProcessingSummary
    ) -> list[dict]:
        """Clean every article's content, dropping ones that fail the
        minimum-length validation (they're excluded from downstream
        processing but still get an update so status is queryable)."""
        cleaned: list[dict] = []
        for article in articles:
            url = article.get("article_url", "unknown")
            raw_content = article.get("content") or ""

            try:
                clean_content = self.cleaner.clean(raw_content)
            except Exception as exc:
                logger.error("Cleaning failed for %s: %s", url, exc)
                clean_content = ""

            is_valid = self.cleaner.is_valid_length(clean_content)
            if not is_valid:
                summary.skipped_short += 1
                logger.info("Skipping too-short/empty article: %s", url)
                continue

            enriched = dict(article)
            enriched["clean_content"] = clean_content
            cleaned.append(enriched)

        return cleaned

    def _enrich_article(self, article: dict, dup_result: DuplicateResult) -> dict:
        """Run summary/sentiment/keywords/entities for one article and
        assemble the final MongoDB update document."""
        url = article["article_url"]
        clean_content = article["clean_content"]
        start_time = time.monotonic()

        summary_result = self.summarizer.summarize(clean_content, article_url=url)
        sentiment_result = self.sentiment_analyzer.analyze(clean_content, article_url=url)
        keywords = self.keyword_extractor.extract(clean_content, article_url=url)
        entities = self.entity_extractor.extract(clean_content, article_url=url)

        elapsed = time.monotonic() - start_time
        logger.info("Processing time for %s: %.2fs", url, elapsed)

        update = {
            "clean_content": clean_content,
            "summary": summary_result.summary,
            "word_count": summary_result.word_count if summary_result.method != "none"
            else 0,
            "reading_time": summary_result.reading_time,
            "character_count": summary_result.character_count,
            "keywords": keywords,
            "entities": entities,
            "sentiment": sentiment_result.sentiment,
            "sentiment_score": sentiment_result.sentiment_score,
            "positive_score": sentiment_result.positive_score,
            "neutral_score": sentiment_result.neutral_score,
            "negative_score": sentiment_result.negative_score,
            "is_duplicate": False,
            "duplicate_of": None,
            "similarity_score": None,
            "processed_at": datetime.now(timezone.utc),
        }
        logger.info("MongoDB update prepared for %s", url)
        return update

    def _duplicate_update(self, dup_result: DuplicateResult) -> dict:
        """Build the (much smaller) update for an article flagged as a
        duplicate — no need to summarize/analyze content we're discarding."""
        return {
            "is_duplicate": True,
            "duplicate_of": dup_result.duplicate_of,
            "similarity_score": dup_result.similarity_score,
            "processed_at": datetime.now(timezone.utc),
        }
