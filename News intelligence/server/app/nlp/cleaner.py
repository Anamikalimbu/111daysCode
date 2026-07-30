"""
Article content cleaning.

Produces `clean_content` from an article's raw `content`, without ever
mutating the original field. Handles HTML remnants, boilerplate
nav/ad text, emojis, stray symbols, and whitespace/quote normalization.
"""

from __future__ import annotations

import re

from bs4 import BeautifulSoup

from app.nlp.utils import normalize_whitespace, word_count
from app.utils.logger import get_logger

logger = get_logger(__name__)

MIN_CONTENT_WORDS = 150

# Common boilerplate phrases that leak into scraped article bodies from
# navigation bars, ad slots, and newsletter prompts. Matched case-insensitively
# as whole lines/segments so they don't accidentally eat real sentences.
_BOILERPLATE_PATTERNS = [
    r"^\s*advertisement\s*$",
    r"^\s*sponsored\s*content\s*$",
    r"^\s*share\s+this\s+article\s*$",
    r"^\s*subscribe\s+to\s+our\s+newsletter.*$",
    r"^\s*sign\s+up\s+for\s+.*newsletter.*$",
    r"^\s*read\s+more\s*:?\s*$",
    r"^\s*related\s+articles?\s*:?\s*$",
    r"^\s*follow\s+us\s+on\s+.*$",
    r"^\s*click\s+here\s+to\s+.*$",
    r"^\s*(home|menu|navigation|skip\s+to\s+content)\s*$",
    r"^\s*cookie\s+policy.*$",
    r"^\s*all\s+rights\s+reserved.*$",
]
_BOILERPLATE_RE = re.compile(
    "|".join(_BOILERPLATE_PATTERNS), flags=re.IGNORECASE | re.MULTILINE
)

_EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001FAFF"  # symbols, pictographs, emoticons, transport
    "\U00002600-\U000027BF"  # misc symbols & dingbats
    "\U0001F1E6-\U0001F1FF"  # regional indicators (flags)
    "\U00002190-\U000021FF"  # arrows
    "\U0000FE0F"             # variation selector
    "]+",
    flags=re.UNICODE,
)

# Curly/smart quotes and dashes -> plain ASCII equivalents.
_QUOTE_MAP = str.maketrans(
    {
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2013": "-",
        "\u2014": "-",
        "\u2026": "...",
    }
)

# Symbols that occasionally survive scraping but add no semantic value.
_UNWANTED_SYMBOLS_RE = re.compile(r"[\u00a0\u200b\u200c\u200d\ufeff]")


class ArticleCleaner:
    """Cleans raw scraped article content into normalized `clean_content`."""

    def strip_html(self, text: str) -> str:
        """Remove any HTML tags left over from scraping."""
        if not text:
            return ""
        # Only run through BeautifulSoup if it actually looks like HTML,
        # to avoid unnecessary parsing overhead on plain text.
        if "<" in text and ">" in text:
            return BeautifulSoup(text, "html.parser").get_text(separator=" ")
        return text

    def remove_boilerplate(self, text: str) -> str:
        """Strip common ad/navigation/newsletter boilerplate lines."""
        return _BOILERPLATE_RE.sub("", text)

    def remove_emojis(self, text: str) -> str:
        """Strip emoji characters."""
        return _EMOJI_RE.sub("", text)

    def remove_unwanted_symbols(self, text: str) -> str:
        """Strip zero-width/invisible characters that break word counts."""
        return _UNWANTED_SYMBOLS_RE.sub("", text)

    def normalize_quotes(self, text: str) -> str:
        """Convert smart quotes/dashes/ellipses to plain ASCII equivalents."""
        return text.translate(_QUOTE_MAP)

    def clean(self, raw_content: str) -> str:
        """Run the full cleaning pipeline on raw article content.

        Returns an empty string if cleaning leaves nothing meaningful —
        callers should check `is_valid_length` before storing.
        """
        if not raw_content:
            return ""

        text = self.strip_html(raw_content)
        text = self.remove_boilerplate(text)
        text = self.remove_emojis(text)
        text = self.remove_unwanted_symbols(text)
        text = self.normalize_quotes(text)
        text = normalize_whitespace(text)

        return text

    @staticmethod
    def is_valid_length(clean_content: str, min_words: int = MIN_CONTENT_WORDS) -> bool:
        """Return True if cleaned content meets the minimum word count and
        isn't empty. Articles failing this should be excluded downstream."""
        if not clean_content or not clean_content.strip():
            return False
        return word_count(clean_content) >= min_words


def clean_article_content(raw_content: str, article_url: str = "") -> tuple[str, bool]:
    """Convenience function: clean content and report whether it's usable.

    Returns:
        (clean_content, is_valid) — is_valid is False for empty or
        sub-150-word articles, which `processor.py` should skip.
    """
    cleaner = ArticleCleaner()
    clean_content = cleaner.clean(raw_content)
    is_valid = cleaner.is_valid_length(clean_content)

    if not is_valid:
        logger.info(
            "Article failed cleaning validation (empty or < %d words): %s",
            MIN_CONTENT_WORDS,
            article_url or "unknown URL",
        )
    else:
        logger.info(
            "Cleaning completed for %s (%d words).",
            article_url or "unknown URL",
            word_count(clean_content),
        )

    return clean_content, is_valid
