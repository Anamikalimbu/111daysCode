"""
Full-article enrichment.

Given an ArticleCreate produced from an RSS entry (title/description/url
only), fetch the actual article page and fill in the full body text,
author, and main image — using newspaper3k for extraction, with a
BeautifulSoup-based fallback if newspaper3k fails.
"""

from __future__ import annotations

from typing import Optional

import requests
from bs4 import BeautifulSoup
from newspaper import Article as NewspaperArticle
from requests.exceptions import RequestException, Timeout

from app.models.article import ArticleCreate
from app.utils.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class FullArticleFetcher:
    """Fetches and extracts full article content for a given URL."""

    def __init__(self) -> None:
        self.settings = get_settings()

    def enrich(self, article: ArticleCreate) -> ArticleCreate:
        """Return a copy of `article` enriched with full content/author/image.

        Never raises. If enrichment fails entirely, the original article
        (with whatever RSS-level data it already had) is returned unchanged.
        """
        try:
            enriched = self._enrich_with_newspaper(article)
            if enriched is not None:
                return enriched
        except Exception as exc:
            logger.warning(
                "newspaper3k extraction failed for %s: %s", article.article_url, exc
            )

        try:
            enriched = self._enrich_with_bs4(article)
            if enriched is not None:
                return enriched
        except Exception as exc:
            logger.warning(
                "Fallback BeautifulSoup extraction failed for %s: %s",
                article.article_url,
                exc,
            )

        logger.warning(
            "Could not enrich article %s; keeping RSS-only data.",
            article.article_url,
        )
        return article

    def _enrich_with_newspaper(self, article: ArticleCreate) -> Optional[ArticleCreate]:
        """Primary extraction path using newspaper3k."""
        np_article = NewspaperArticle(article.article_url)
        np_article.download()
        np_article.parse()

        content = np_article.text.strip() if np_article.text else None
        if not content:
            return None

        author = ", ".join(np_article.authors) if np_article.authors else article.author
        image_url = np_article.top_image or article.image_url

        return article.model_copy(
            update={
                "content": content,
                "author": author or article.author,
                "image_url": image_url or article.image_url,
            }
        )

    def _enrich_with_bs4(self, article: ArticleCreate) -> Optional[ArticleCreate]:
        """Fallback extraction using requests + BeautifulSoup.

        Strips nav/header/footer/script/style/aside elements and joins
        remaining paragraph text as a best-effort article body.
        """
        headers = {"User-Agent": self.settings.scraper_user_agent}
        try:
            response = requests.get(
                article.article_url,
                headers=headers,
                timeout=self.settings.request_timeout_seconds,
            )
            response.raise_for_status()
        except Timeout:
            logger.warning("Timeout fetching %s", article.article_url)
            return None
        except RequestException as exc:
            logger.warning("Request error fetching %s: %s", article.article_url, exc)
            return None

        soup = BeautifulSoup(response.text, "html.parser")

        for tag_name in ("nav", "header", "footer", "script", "style", "aside", "form"):
            for tag in soup.find_all(tag_name):
                tag.decompose()

        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
        content = "\n\n".join(p for p in paragraphs if len(p) > 40)
        if not content:
            return None

        image_url = article.image_url
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            image_url = og_image["content"]

        author = article.author
        author_meta = soup.find("meta", attrs={"name": "author"})
        if author_meta and author_meta.get("content"):
            author = author_meta["content"]

        return article.model_copy(
            update={"content": content, "author": author, "image_url": image_url}
        )
