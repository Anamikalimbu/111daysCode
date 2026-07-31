"""
API routes for processed articles and NLP-derived analytics.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.services.processing_service import ProcessingService
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()


def get_processing_service() -> ProcessingService:
    """Dependency-style factory for ProcessingService."""
    return ProcessingService()


@router.get("/processed")
def get_processed_articles(
    limit: int = Query(default=50, ge=1, le=200),
    skip: int = Query(default=0, ge=0),
) -> dict:
    """Return all processed (cleaned, deduped, enriched) articles."""
    try:
        service = get_processing_service()
        articles = service.get_processed_articles(limit=limit, skip=skip)
        return {"count": len(articles), "articles": articles}
    except Exception as exc:
        logger.error("Error fetching processed articles: %s", exc)
        raise HTTPException(
            status_code=500, detail="Failed to fetch processed articles"
        ) from exc


@router.get("/article/{article_id}")
def get_article(article_id: str) -> dict:
    """Return the full processed article (all NLP + clustering fields).

    Added to support the frontend's Article Details page, which needs
    more than the title/summary/reading_time that `/summary/{id}` exposes.
    """
    try:
        service = get_processing_service()
        article = service.get_article_by_id(article_id)
    except Exception as exc:
        logger.error("Error fetching article %s: %s", article_id, exc)
        raise HTTPException(status_code=500, detail="Failed to fetch article") from exc

    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/summary/{article_id}")
def get_article_summary(article_id: str) -> dict:
    """Return the title, AI summary, and reading time for one article."""
    try:
        service = get_processing_service()
        article = service.get_article_by_id(article_id)
    except Exception as exc:
        logger.error("Error fetching summary for %s: %s", article_id, exc)
        raise HTTPException(status_code=500, detail="Failed to fetch summary") from exc

    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")

    return {
        "title": article.get("title"),
        "summary": article.get("summary"),
        "reading_time": article.get("reading_time"),
    }


@router.get("/sentiment")
def get_sentiment_stats() -> dict:
    """Return sentiment distribution (as percentages) across processed articles."""
    try:
        service = get_processing_service()
        return service.get_sentiment_stats()
    except Exception as exc:
        logger.error("Error computing sentiment stats: %s", exc)
        raise HTTPException(
            status_code=500, detail="Failed to compute sentiment stats"
        ) from exc


@router.get("/keywords")
def get_trending_keywords(
    top_n: int = Query(default=20, ge=1, le=100)
) -> dict:
    """Return the most frequently occurring keywords across processed articles."""
    try:
        service = get_processing_service()
        keywords = service.get_trending_keywords(top_n=top_n)
        return {"keywords": keywords}
    except Exception as exc:
        logger.error("Error fetching trending keywords: %s", exc)
        raise HTTPException(
            status_code=500, detail="Failed to fetch trending keywords"
        ) from exc


@router.get("/entities")
def get_top_entities(top_n: int = Query(default=10, ge=1, le=50)) -> dict:
    """Return the most-mentioned people, organisations, and countries."""
    try:
        service = get_processing_service()
        return service.get_top_entities(top_n=top_n)
    except Exception as exc:
        logger.error("Error fetching top entities: %s", exc)
        raise HTTPException(
            status_code=500, detail="Failed to fetch top entities"
        ) from exc
