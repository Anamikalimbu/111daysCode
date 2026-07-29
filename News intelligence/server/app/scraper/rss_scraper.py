"""
RSS feed scraping.

Parses RSS feeds from trusted news sources into lightweight
`ArticleCreate` objects (title, description, url, published date,
source, image if present in the feed). Full article body/author/image
enrichment happens separately in `full_article.py`.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

import feedparser

from app.models.article import ArticleCreate
from app.utils.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Trusted RSS sources supported on Day 1. Adding a source is just adding
# an entry here — no other code changes required.
RSS_SOURCES: dict[str, str] = {
    "BBC News": "http://feeds.bbci.co.uk/news/rss.xml",
    "CNN": "http://rss.cnn.com/rss/cnn_topstories.rss",
    "Reuters": "https://feeds.reuters.com/reuters/topNews",
    "The Guardian": "https://www.theguardian.com/world/rss",
}


class RSSFeedScraper:
    """Fetches and parses RSS feeds into ArticleCreate objects."""

    def __init__(self, sources: Optional[dict[str, str]] = None) -> None:
        self.sources = sources or RSS_SOURCES
        self.settings = get_settings()

    def scrape_source(self, source_name: str, feed_url: str) -> list[ArticleCreate]:
        """Parse a single RSS feed and return its articles.

        Never raises: any parsing failure is logged and results in an
        empty list, so one bad feed can't take down the whole run.
        """
        logger.info("Scraping source: %s", source_name)
        articles: list[ArticleCreate] = []

        try:
            feed = feedparser.parse(feed_url)
        except Exception as exc:  # feedparser can raise a variety of errors
            logger.error("Failed to fetch/parse feed for %s: %s", source_name, exc)
            return articles

        if getattr(feed, "bozo", 0) and feed.bozo_exception:
            logger.warning(
                "Feed for %s parsed with warnings: %s",
                source_name,
                feed.bozo_exception,
            )

        entries = feed.entries[: self.settings.max_articles_per_source]
        for entry in entries:
            article = self._entry_to_article(entry, source_name)
            if article is not None:
                articles.append(article)

        logger.info("Found %d articles from %s", len(articles), source_name)
        return articles

    def scrape_all(self) -> list[ArticleCreate]:
        """Scrape every configured RSS source, skipping any that fail."""
        logger.info("Scraper started for %d source(s).", len(self.sources))
        all_articles: list[ArticleCreate] = []

        for source_name, feed_url in self.sources.items():
            try:
                all_articles.extend(self.scrape_source(source_name, feed_url))
            except Exception as exc:  # defense in depth: one source can't kill the run
                logger.error("Unexpected error scraping %s: %s", source_name, exc)
                continue

        logger.info("Scraper finished. Total articles found: %d", len(all_articles))
        return all_articles

    @staticmethod
    def _entry_to_article(entry, source_name: str) -> Optional[ArticleCreate]:
        """Convert a single feedparser entry into an ArticleCreate.

        Returns None (and logs) if the entry is missing required fields.
        """
        title = getattr(entry, "title", None)
        article_url = getattr(entry, "link", None)

        if not title or not article_url:
            logger.warning(
                "Skipping entry from %s: missing title or url.", source_name
            )
            return None

        description = getattr(entry, "summary", None) or getattr(
            entry, "description", None
        )
        published_date = RSSFeedScraper._parse_published_date(entry)
        image_url = RSSFeedScraper._extract_image(entry)
        category = RSSFeedScraper._extract_category(entry)

        try:
            return ArticleCreate(
                title=title,
                description=description,
                content=None,
                source=source_name,
                author=getattr(entry, "author", None),
                published_date=published_date,
                image_url=image_url,
                article_url=article_url,
                category=category,
            )
        except Exception as exc:  # pydantic ValidationError or similar
            logger.warning(
                "Skipping invalid entry from %s (%s): %s",
                source_name,
                article_url,
                exc,
            )
            return None

    @staticmethod
    def _parse_published_date(entry) -> Optional[datetime]:
        """Extract a timezone-aware published date from a feed entry."""
        time_struct = getattr(entry, "published_parsed", None) or getattr(
            entry, "updated_parsed", None
        )
        if not time_struct:
            return None
        try:
            return datetime(*time_struct[:6], tzinfo=timezone.utc)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _extract_image(entry) -> Optional[str]:
        """Pull an image URL out of common RSS media fields, if present."""
        media_content = getattr(entry, "media_content", None)
        if media_content:
            url = media_content[0].get("url")
            if url:
                return url

        media_thumbnail = getattr(entry, "media_thumbnail", None)
        if media_thumbnail:
            url = media_thumbnail[0].get("url")
            if url:
                return url

        for link in getattr(entry, "links", []) or []:
            if link.get("type", "").startswith("image/"):
                return link.get("href")

        return None

    @staticmethod
    def _extract_category(entry) -> Optional[str]:
        """Pull the first available category/tag from a feed entry."""
        tags = getattr(entry, "tags", None)
        if tags:
            term = tags[0].get("term")
            if term:
                return term
        return None
