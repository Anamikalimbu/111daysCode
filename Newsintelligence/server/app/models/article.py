"""
Pydantic data models for news articles.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ArticleBase(BaseModel):
    """Core fields shared by article creation and storage."""

    title: str = Field(..., min_length=1, description="Article headline")
    description: Optional[str] = Field(
        default=None, description="Short summary / dek from the RSS feed"
    )
    content: Optional[str] = Field(
        default=None, description="Full raw article body text as scraped"
    )
    source: str = Field(..., min_length=1, description="Publisher, e.g. 'BBC News'")
    author: Optional[str] = Field(default=None, description="Byline, if available")
    published_date: Optional[datetime] = Field(
        default=None, description="Original publication timestamp"
    )
    image_url: Optional[str] = Field(
        default=None, description="URL of the article's main image"
    )
    article_url: str = Field(..., min_length=1, description="Canonical article URL")
    category: Optional[str] = Field(
        default=None, description="Topic/category, e.g. 'World', 'Technology'"
    )

    @field_validator("title", "source", "article_url")
    @classmethod
    def _not_blank(cls, value: str) -> str:
        """Reject empty/whitespace-only required string fields."""
        if not value or not value.strip():
            raise ValueError("must not be blank")
        return value.strip()

    @field_validator("article_url", "image_url")
    @classmethod
    def _valid_url_if_present(cls, value: Optional[str]) -> Optional[str]:
        """Loosely validate that URL fields look like URLs, without being
        so strict we drop otherwise-good articles over edge-case URLs."""
        if value is None or value == "":
            return value
        if not (value.startswith("http://") or value.startswith("https://")):
            raise ValueError("must be a valid http(s) URL")
        return value


class ArticleCreate(ArticleBase):
    """Shape used when a scraper produces a new article, pre-storage."""

    pass


class Article(ArticleBase):
    """Shape used when an article is stored in / read from MongoDB."""

    scraped_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp when this article was scraped",
    )

    def to_mongo_dict(self) -> dict:
        """Serialize to a plain dict suitable for MongoDB insertion."""
        return self.model_dump(exclude_none=False)


class ProcessedArticle(Article):
    """Article shape after the NLP pipeline has run.

    Every field here is additive on top of `Article` — original fields
    (`content`, `title`, etc.) are never overwritten by processing.
    All processing fields are optional so partially-processed articles
    (e.g. a step failed) still validate.
    """

    # --- Cleaning ---
    clean_content: Optional[str] = Field(
        default=None, description="HTML/boilerplate-stripped article text"
    )

    # --- Duplicate detection ---
    is_duplicate: bool = Field(
        default=False, description="Whether this article was flagged as a duplicate"
    )
    duplicate_of: Optional[str] = Field(
        default=None, description="article_url of the original this duplicates"
    )
    similarity_score: Optional[float] = Field(
        default=None, ge=0.0, le=1.0, description="Similarity score vs. duplicate_of"
    )

    # --- Summarization ---
    summary: Optional[str] = Field(default=None, description="AI-generated summary")
    word_count: Optional[int] = Field(
        default=None, ge=0, description="Word count of clean_content"
    )
    character_count: Optional[int] = Field(
        default=None, ge=0, description="Character count of clean_content"
    )
    reading_time: Optional[int] = Field(
        default=None, ge=0, description="Estimated reading time in minutes"
    )

    # --- Sentiment ---
    sentiment: Optional[str] = Field(
        default=None, description="'positive' | 'neutral' | 'negative'"
    )
    sentiment_score: Optional[float] = Field(
        default=None, ge=-1.0, le=1.0, description="VADER compound score"
    )
    positive_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    neutral_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    negative_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)

    # --- Keywords & entities ---
    keywords: list[str] = Field(default_factory=list)
    entities: dict[str, list[str]] = Field(default_factory=dict)

    # --- Pipeline metadata ---
    processed_at: Optional[datetime] = Field(
        default=None, description="Timestamp when NLP processing completed"
    )

    # --- Clustering & topics (Day 3) ---
    cluster_id: Optional[str] = Field(
        default=None, description="Stable ID of the topic cluster this article belongs to"
    )
    topic_name: Optional[str] = Field(
        default=None, description="Human-readable topic name, e.g. 'Tesla Earnings'"
    )
    cluster_size: Optional[int] = Field(
        default=None, ge=0, description="Number of articles in this article's cluster"
    )
    cluster_score: Optional[float] = Field(
        default=None,
        ge=-1.0,
        le=1.0,
        description="This article's cosine similarity to its cluster's centroid",
    )
    related_articles: list[dict] = Field(
        default_factory=list,
        description="Up to 5 most similar articles from the same cluster "
        "(each: article_id, title, similarity_score)",
    )
    trending_score: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0,
        description="Trending score of this article's cluster (0-1)",
    )
