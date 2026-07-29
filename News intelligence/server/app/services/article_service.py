"""
Article storage and orchestration service.

Wires together the RSS scraper, full-article fetcher, and MongoDB
storage: scrape -> enrich -> dedupe -> insert.
"""

from __future__ import annotations

from typing import Optional

from pymongo.errors import DuplicateKeyError, PyMongoError

from app.database.connection import get_mongo_connection
from app.models.article import Article, ArticleCreate
from app.scraper.full_article import FullArticleFetcher
from app.scraper.rss_scraper import RSSFeedScraper
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ArticleService:
    """Business logic for scraping, storing, and reading articles."""

    def __init__(self) -> None:
        self.connection = get_mongo_connection()
        self.rss_scraper = RSSFeedScraper()
        self.full_article_fetcher = FullArticleFetcher()
        self._ensure_indexes()

    def _ensure_indexes(self) -> None:
        """Create a unique index on article_url so duplicates can never
        be inserted, even under concurrent scrape runs."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.warning("Skipping index creation: no MongoDB connection.")
            return
        try:
            collection.create_index("article_url", unique=True)
        except PyMongoError as exc:
            logger.error("Failed to create unique index on article_url: %s", exc)

    def article_exists(self, article_url: str) -> bool:
        """Check whether an article with this URL is already stored."""
        collection = self.connection.get_collection()
        if collection is None:
            return False
        return collection.find_one({"article_url": article_url}) is not None

    def store_article(self, article_create: ArticleCreate) -> Optional[str]:
        """Insert a single article if it doesn't already exist.

        Returns the inserted document's string ID, or None if the
        article was a duplicate or the insert failed.
        """
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot store article: no MongoDB connection.")
            return None

        if self.article_exists(article_create.article_url):
            logger.info("Duplicate skipped: %s", article_create.article_url)
            return None

        article = Article(**article_create.model_dump())
        try:
            result = collection.insert_one(article.to_mongo_dict())
            logger.info(
                "Inserted article '%s' from %s", article.title, article.source
            )
            return str(result.inserted_id)
        except DuplicateKeyError:
            # Race condition safeguard: another run inserted it first.
            logger.info("Duplicate skipped (race): %s", article_create.article_url)
            return None
        except PyMongoError as exc:
            logger.error(
                "Failed to insert article '%s': %s", article_create.title, exc
            )
            return None

    def run_scrape_and_store(self, enrich_full_content: bool = True) -> dict:
        """Run the full pipeline: scrape all sources, enrich, store.

        Returns a summary dict with counts, suitable for logging or
        returning from an API endpoint.
        """
        summary = {"found": 0, "inserted": 0, "duplicates": 0, "failed": 0}

        articles = self.rss_scraper.scrape_all()
        summary["found"] = len(articles)

        for article_create in articles:
            try:
                if enrich_full_content:
                    article_create = self.full_article_fetcher.enrich(article_create)

                inserted_id = self.store_article(article_create)
                if inserted_id is not None:
                    summary["inserted"] += 1
                elif self.article_exists(article_create.article_url):
                    summary["duplicates"] += 1
                else:
                    summary["failed"] += 1
            except Exception as exc:
                logger.error(
                    "Unexpected error processing article %s: %s",
                    getattr(article_create, "article_url", "unknown"),
                    exc,
                )
                summary["failed"] += 1

        logger.info(
            "Scrape run complete. Found: %d | Inserted: %d | Duplicates: %d | Failed: %d",
            summary["found"],
            summary["inserted"],
            summary["duplicates"],
            summary["failed"],
        )
        return summary

    def get_all_articles(self, limit: int = 100, skip: int = 0) -> list[dict]:
        """Return stored articles, most recently scraped first."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch articles: no MongoDB connection.")
            return []

        try:
            cursor = (
                collection.find()
                .sort("scraped_at", -1)
                .skip(skip)
                .limit(limit)
            )
            articles = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                articles.append(doc)
            return articles
        except PyMongoError as exc:
            logger.error("Failed to fetch articles: %s", exc)
            return []

    def count_articles(self) -> int:
        """Return the total number of stored articles."""
        collection = self.connection.get_collection()
        if collection is None:
            return 0
        try:
            return collection.count_documents({})
        except PyMongoError as exc:
            logger.error("Failed to count articles: %s", exc)
            return 0
