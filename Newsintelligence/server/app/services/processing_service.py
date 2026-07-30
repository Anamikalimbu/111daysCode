"""
Processing service: bridges MongoDB storage and the NLP pipeline.

Fetches articles that haven't been processed yet, runs them through
`ArticleProcessor`, and writes the resulting fields back with `$set`
(so original scraped fields are never overwritten).
"""

from __future__ import annotations

from pymongo import UpdateOne
from pymongo.errors import PyMongoError

from app.database.connection import get_mongo_connection
from app.nlp.processor import ArticleProcessor
from app.utils.logger import get_logger

logger = get_logger(__name__)

DEFAULT_BATCH_SIZE = 100


class ProcessingService:
    """Orchestrates fetching, NLP-processing, and persisting article updates."""

    def __init__(self) -> None:
        self.connection = get_mongo_connection()
        self.processor = ArticleProcessor()

    def get_unprocessed_articles(self, batch_size: int = DEFAULT_BATCH_SIZE) -> list[dict]:
        """Return raw article documents that haven't been through the
        NLP pipeline yet (no `processed_at` timestamp)."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch unprocessed articles: no MongoDB connection.")
            return []

        try:
            cursor = collection.find(
                {"processed_at": {"$exists": False}}
            ).limit(batch_size)
            return list(cursor)
        except PyMongoError as exc:
            logger.error("Failed to fetch unprocessed articles: %s", exc)
            return []

    def run_processing_batch(self, batch_size: int = DEFAULT_BATCH_SIZE) -> dict:
        """Fetch a batch of unprocessed articles, run the NLP pipeline,
        and persist the results. Returns a summary dict."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot run processing batch: no MongoDB connection.")
            return {"fetched": 0, "updated": 0, "failed": 0}

        articles = self.get_unprocessed_articles(batch_size)
        if not articles:
            logger.info("No unprocessed articles found.")
            return {"fetched": 0, "updated": 0, "failed": 0}

        logger.info("Fetched %d unprocessed article(s) for NLP processing.", len(articles))
        updates = self.processor.process_batch(articles)

        updated_count = 0
        failed_count = 0
        operations = []
        for article_url, update_fields in updates.items():
            operations.append(
                UpdateOne({"article_url": article_url}, {"$set": update_fields})
            )

        if operations:
            try:
                result = collection.bulk_write(operations, ordered=False)
                updated_count = result.modified_count
                logger.info("MongoDB updated: %d article(s) written.", updated_count)
            except PyMongoError as exc:
                failed_count = len(operations)
                logger.error("Bulk update to MongoDB failed: %s", exc)

        return {
            "fetched": len(articles),
            "updated": updated_count,
            "failed": failed_count,
        }

    # ------------------------------------------------------------------
    # Read-side queries for the analytics/processed-article endpoints
    # ------------------------------------------------------------------

    def get_processed_articles(self, limit: int = 50, skip: int = 0) -> list[dict]:
        """Return processed, non-duplicate articles, most recent first."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch processed articles: no MongoDB connection.")
            return []

        try:
            cursor = (
                collection.find({"processed_at": {"$exists": True}, "is_duplicate": False})
                .sort("processed_at", -1)
                .skip(skip)
                .limit(limit)
            )
            articles = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                articles.append(doc)
            return articles
        except PyMongoError as exc:
            logger.error("Failed to fetch processed articles: %s", exc)
            return []

    def get_article_by_id(self, article_id: str) -> dict | None:
        """Return a single article by its MongoDB _id string."""
        from bson import ObjectId
        from bson.errors import InvalidId

        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch article: no MongoDB connection.")
            return None

        try:
            object_id = ObjectId(article_id)
        except InvalidId:
            logger.warning("Invalid article id requested: %s", article_id)
            return None

        try:
            doc = collection.find_one({"_id": object_id})
            if doc:
                doc["_id"] = str(doc["_id"])
            return doc
        except PyMongoError as exc:
            logger.error("Failed to fetch article %s: %s", article_id, exc)
            return None

    def get_sentiment_stats(self) -> dict:
        """Return sentiment distribution (percentages) across processed articles."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot compute sentiment stats: no MongoDB connection.")
            return {"positive": 0, "neutral": 0, "negative": 0}

        try:
            pipeline = [
                {"$match": {"processed_at": {"$exists": True}, "is_duplicate": False}},
                {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}},
            ]
            counts = {doc["_id"]: doc["count"] for doc in collection.aggregate(pipeline)}
        except PyMongoError as exc:
            logger.error("Failed to compute sentiment stats: %s", exc)
            return {"positive": 0, "neutral": 0, "negative": 0}

        total = sum(counts.values())
        if total == 0:
            return {"positive": 0, "neutral": 0, "negative": 0}

        return {
            "positive": round(counts.get("positive", 0) / total * 100),
            "neutral": round(counts.get("neutral", 0) / total * 100),
            "negative": round(counts.get("negative", 0) / total * 100),
        }

    def get_trending_keywords(self, top_n: int = 20) -> list[dict]:
        """Return the most frequently occurring keywords across processed articles."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch trending keywords: no MongoDB connection.")
            return []

        try:
            pipeline = [
                {"$match": {"processed_at": {"$exists": True}, "is_duplicate": False}},
                {"$unwind": "$keywords"},
                {"$group": {"_id": "$keywords", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": top_n},
            ]
            return [
                {"keyword": doc["_id"], "count": doc["count"]}
                for doc in collection.aggregate(pipeline)
            ]
        except PyMongoError as exc:
            logger.error("Failed to fetch trending keywords: %s", exc)
            return []

    def get_top_entities(self, top_n: int = 10) -> dict:
        """Return the most-mentioned people, organizations, and places."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch top entities: no MongoDB connection.")
            return {"people": [], "organisations": [], "countries": []}

        result = {}
        entity_map = {"people": "PERSON", "organisations": "ORG", "countries": "GPE"}
        for output_key, entity_type in entity_map.items():
            try:
                pipeline = [
                    {
                        "$match": {
                            "processed_at": {"$exists": True},
                            "is_duplicate": False,
                            f"entities.{entity_type}": {"$exists": True},
                        }
                    },
                    {"$unwind": f"$entities.{entity_type}"},
                    {"$group": {"_id": f"$entities.{entity_type}", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}},
                    {"$limit": top_n},
                ]
                result[output_key] = [
                    {"name": doc["_id"], "count": doc["count"]}
                    for doc in collection.aggregate(pipeline)
                ]
            except PyMongoError as exc:
                logger.error("Failed to fetch top %s: %s", output_key, exc)
                result[output_key] = []

        return result
