"""
Analytics and topic-query service.

Backs the `/topics`, `/topics/{cluster_id}`, `/trending`, `/analytics`,
and `/related/{article_id}` endpoints. Clustering itself (embedding,
grouping, naming, scoring) already happened in `ClusteringService` and
was persisted to MongoDB — this service just reads that data back and,
where needed, aggregates it via `app/nlp/analytics.py`'s pure functions.
"""

from __future__ import annotations

from collections import defaultdict

from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError

from app.database.connection import get_mongo_connection
from app.nlp.analytics import compute_full_analytics, get_trending_topics
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AnalyticsService:
    """Reads clustered/processed articles back out of MongoDB for the
    topics, trending, and analytics endpoints."""

    def __init__(self) -> None:
        self.connection = get_mongo_connection()

    def _fetch_clustered_articles(self) -> list[dict]:
        """Fetch all processed, non-duplicate, clustered articles."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch clustered articles: no MongoDB connection.")
            return []
        try:
            cursor = collection.find(
                {
                    "processed_at": {"$exists": True},
                    "is_duplicate": False,
                    "cluster_id": {"$exists": True, "$ne": None},
                }
            )
            docs = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                docs.append(doc)
            return docs
        except PyMongoError as exc:
            logger.error("Failed to fetch clustered articles: %s", exc)
            return []

    def list_topics(self) -> list[dict]:
        """Return every discovered topic with its article count."""
        articles = self._fetch_clustered_articles()
        by_cluster: dict[str, list[dict]] = defaultdict(list)
        for article in articles:
            by_cluster[article["cluster_id"]].append(article)

        topics = [
            {
                "cluster_id": cluster_id,
                "topic": members[0].get("topic_name"),
                "articles": len(members),
            }
            for cluster_id, members in by_cluster.items()
        ]
        topics.sort(key=lambda t: t["articles"], reverse=True)
        return topics

    def get_topic_detail(self, cluster_id: str) -> dict | None:
        """Return topic name, member articles, a representative summary,
        and average sentiment for one cluster."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch topic detail: no MongoDB connection.")
            return None

        try:
            cursor = collection.find({"cluster_id": cluster_id})
            members = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                members.append(doc)
        except PyMongoError as exc:
            logger.error("Failed to fetch topic %s: %s", cluster_id, exc)
            return None

        if not members:
            return None

        # Representative summary: the article closest to the cluster
        # centroid (highest cluster_score) speaks for the topic best.
        representative = max(members, key=lambda a: a.get("cluster_score") or 0.0)

        sentiment_scores = [
            m["sentiment_score"] for m in members if isinstance(m.get("sentiment_score"), (int, float))
        ]
        avg_sentiment = (
            round(sum(sentiment_scores) / len(sentiment_scores), 4) if sentiment_scores else None
        )

        return {
            "cluster_id": cluster_id,
            "topic_name": members[0].get("topic_name"),
            "article_count": len(members),
            "topic_summary": representative.get("summary"),
            "average_sentiment": avg_sentiment,
            "articles": [
                {
                    "article_id": m["_id"],
                    "title": m.get("title"),
                    "source": m.get("source"),
                    "sentiment": m.get("sentiment"),
                    "published_date": m.get("published_date"),
                }
                for m in members
            ],
        }

    def get_trending(self, top_n: int = 10) -> list[dict]:
        """Return the top N trending topics."""
        articles = self._fetch_clustered_articles()
        return get_trending_topics(articles, top_n=top_n)

    def get_related_articles(self, article_id: str) -> list[dict] | None:
        """Return the stored related_articles list for one article."""
        collection = self.connection.get_collection()
        if collection is None:
            logger.error("Cannot fetch related articles: no MongoDB connection.")
            return None

        try:
            object_id = ObjectId(article_id)
        except InvalidId:
            logger.warning("Invalid article id requested for related lookup: %s", article_id)
            return None

        try:
            doc = collection.find_one({"_id": object_id})
        except PyMongoError as exc:
            logger.error("Failed to fetch article %s: %s", article_id, exc)
            return None

        if doc is None:
            return None
        return doc.get("related_articles", [])

    def get_full_analytics(self) -> dict:
        """Assemble the complete /analytics response."""
        articles = self._fetch_clustered_articles()

        collection = self.connection.get_collection()
        total_articles = 0
        if collection is not None:
            try:
                total_articles = collection.count_documents({})
            except PyMongoError as exc:
                logger.error("Failed to count total articles: %s", exc)

        return compute_full_analytics(articles, total_articles_all_time=total_articles)
