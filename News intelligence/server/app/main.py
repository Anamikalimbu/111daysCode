"""
News Intelligence Platform — FastAPI application entrypoint.

Run with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.api.routes import router
from app.database.connection import get_mongo_connection
from app.utils.logger import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Establish the MongoDB connection on startup, close it on shutdown."""
    logger.info("Starting News Intelligence Platform API...")
    connection = get_mongo_connection()
    if connection.is_connected():
        logger.info("Startup check: MongoDB connection is healthy.")
    else:
        logger.warning(
            "Startup check: MongoDB is NOT reachable. "
            "API will still start, but /articles and /health will report the outage."
        )
    yield
    logger.info("Shutting down News Intelligence Platform API...")
    connection.close()


app = FastAPI(
    title="News Intelligence Platform API",
    description=(
        "Collects, stores, and serves news articles scraped from trusted "
        "RSS sources."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc: Exception) -> JSONResponse:
    """Catch-all so an unexpected error never crashes the process —
    it's logged and returned as a clean 500 instead."""
    logger.error("Unhandled exception on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
