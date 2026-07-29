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
        default=None, description="Full cleaned article body text"
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
