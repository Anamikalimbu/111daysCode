"""
Shared text-statistics helpers used across the NLP pipeline.

Kept separate so `cleaner.py`, `summarizer.py`, and `processor.py`
all compute word/character counts and reading time the same way.
"""

from __future__ import annotations

import re

from app.utils.logger import get_logger

logger = get_logger(__name__)

_WORDS_PER_MINUTE = 200  # average adult silent reading speed

SPACY_MODEL_NAME = "en_core_web_sm"
_spacy_nlp = None
_spacy_load_attempted = False


def get_spacy_model():
    """Return a process-wide cached spaCy pipeline, loading it once.

    Shared by `keywords.py` and `entities.py` so the (relatively
    expensive) model load only happens a single time per process.
    Returns None if the model can't be loaded — callers must handle
    that gracefully rather than assuming it's always available.
    """
    global _spacy_nlp, _spacy_load_attempted

    if _spacy_nlp is not None:
        return _spacy_nlp
    if _spacy_load_attempted:
        return None

    _spacy_load_attempted = True
    try:
        import spacy

        _spacy_nlp = spacy.load(SPACY_MODEL_NAME)
        logger.info("Loaded spaCy model '%s'.", SPACY_MODEL_NAME)
    except Exception as exc:
        logger.error(
            "Failed to load spaCy model '%s': %s. "
            "Run `python -m spacy download %s` to install it. "
            "Keyword/entity extraction will use a degraded fallback.",
            SPACY_MODEL_NAME,
            exc,
            SPACY_MODEL_NAME,
        )
        _spacy_nlp = None

    return _spacy_nlp


def word_count(text: str) -> int:
    """Return the number of whitespace-separated words in `text`."""
    if not text:
        return 0
    return len(text.split())


def character_count(text: str) -> int:
    """Return the character length of `text` (excluding surrounding whitespace)."""
    if not text:
        return 0
    return len(text.strip())


def reading_time_minutes(text: str) -> int:
    """Estimate reading time in whole minutes, rounded up, minimum 1."""
    count = word_count(text)
    if count == 0:
        return 0
    minutes = count / _WORDS_PER_MINUTE
    return max(1, round(minutes))


def normalize_whitespace(text: str) -> str:
    """Collapse repeated whitespace/newlines into single spaces."""
    if not text:
        return ""
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n\n", text)
    return text.strip()


def truncate_to_word_range(text: str, min_words: int, max_words: int) -> str:
    """Trim `text` down to at most `max_words` words, preserving sentence
    boundaries where possible. Does not pad text below `min_words` —
    callers decide how to handle text that's naturally too short."""
    words = text.split()
    if len(words) <= max_words:
        return text
    truncated = " ".join(words[:max_words])
    # Try to end on a sentence boundary rather than mid-sentence.
    last_period = truncated.rfind(".")
    if last_period > 0 and last_period > len(truncated) * 0.5:
        return truncated[: last_period + 1]
    return truncated + "..."
