"""
API routes for topics, trending stories, and related-article lookup.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.services.analytics_service import AnalyticsService
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()


def get_analytics_service() -> AnalyticsService:
    """Dependency-style factory for AnalyticsService."""
    return AnalyticsService()


@router.get("/topics")
def get_topics() -> list[dict]:
    """Return all discovered topics with their article counts."""
    try:
        return get_analytics_service().list_topics()
    except Exception as exc:
        logger.error("Error listing topics: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to list topics") from exc


@router.get("/topics/{cluster_id}")
def get_topic_detail(cluster_id: str) -> dict:
    """Return the topic name, member articles, a representative summary,
    and average sentiment for one cluster."""
    try:
        detail = get_analytics_service().get_topic_detail(cluster_id)
    except Exception as exc:
        logger.error("Error fetching topic %s: %s", cluster_id, exc)
        raise HTTPException(status_code=500, detail="Failed to fetch topic") from exc

    if detail is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return detail


@router.get("/trending")
def get_trending(top_n: int = Query(default=10, ge=1, le=50)) -> dict:
    """Return the top trending topics."""
    try:
        return {"trending_topics": get_analytics_service().get_trending(top_n=top_n)}
    except Exception as exc:
        logger.error("Error fetching trending topics: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch trending topics") from exc


@router.get("/related/{article_id}")
def get_related_articles(article_id: str) -> dict:
    """Return the most similar articles to the given article."""
    try:
        related = get_analytics_service().get_related_articles(article_id)
    except Exception as exc:
        logger.error("Error fetching related articles for %s: %s", article_id, exc)
        raise HTTPException(status_code=500, detail="Failed to fetch related articles") from exc

    if related is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"related_articles": related}
