"""
API routes for the News Intelligence Platform.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.database.connection import get_mongo_connection
from app.services.article_service import ArticleService
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()


def get_article_service() -> ArticleService:
    """Dependency-style factory for ArticleService."""
    return ArticleService()


@router.get("/")
def read_root() -> dict:
    """Root endpoint — simple welcome message."""
    return {"message": "News Intelligence Platform API"}


@router.get("/articles")
def get_articles(
    limit: int = Query(default=50, ge=1, le=200, description="Max articles to return"),
    skip: int = Query(default=0, ge=0, description="Number of articles to skip"),
) -> dict:
    """Return stored articles, most recently scraped first."""
    try:
        service = get_article_service()
        articles = service.get_all_articles(limit=limit, skip=skip)
        return {"count": len(articles), "articles": articles}
    except Exception as exc:
        logger.error("Error fetching articles: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch articles") from exc


@router.get("/health")
def health_check() -> dict:
    """Return API status, MongoDB connection status, and article count."""
    connection = get_mongo_connection()
    mongo_connected = connection.is_connected()

    total_articles = 0
    if mongo_connected:
        try:
            total_articles = get_article_service().count_articles()
        except Exception as exc:
            logger.error("Error counting articles during health check: %s", exc)

    return {
        "api_status": "ok",
        "mongodb_connected": mongo_connected,
        "total_articles": total_articles,
    }
