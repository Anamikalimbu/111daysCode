"""
API route for the analytics dashboard endpoint.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.services.analytics_service import AnalyticsService
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.get("/analytics")
def get_analytics() -> dict:
    """Return the full analytics snapshot: totals, source/sentiment
    distributions, topic stats, trending topics, top keywords, top entities."""
    try:
        service = AnalyticsService()
        return service.get_full_analytics()
    except Exception as exc:
        logger.error("Error computing analytics: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to compute analytics") from exc
