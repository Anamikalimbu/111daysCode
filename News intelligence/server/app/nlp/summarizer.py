"""
AI-generated article summarization.

Primary path: Hugging Face `facebook/bart-large-cnn` via a lazily-loaded,
process-wide singleton pipeline (loading the model is expensive, so it
happens once, not per-article).

Fallback path: a lightweight extractive summary (first few sentences,
trimmed to the target word range) if the transformer model can't be
loaded or inference fails for any reason. Summarization failures are
logged but never stop the rest of the processing pipeline.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

from app.nlp.utils import character_count, reading_time_minutes, word_count
from app.utils.logger import get_logger

logger = get_logger(__name__)

SUMMARY_MODEL_NAME = "facebook/bart-large-cnn"
MIN_SUMMARY_WORDS = 50
MAX_SUMMARY_WORDS = 150
MIN_SENTENCES = 3
MAX_SENTENCES = 5

_SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")


@dataclass
class SummaryResult:
    """Output of the summarization stage for a single article."""

    summary: str
    word_count: int
    character_count: int
    reading_time: int
    method: str  # "transformer" | "extractive" | "none"


class ArticleSummarizer:
    """Generates AI summaries, with a safe extractive fallback."""

    _pipeline = None  # process-wide singleton, loaded lazily
    _load_attempted = False
    _load_failed = False

    def _get_pipeline(self):
        """Lazily load the Hugging Face summarization pipeline once per process."""
        cls = ArticleSummarizer
        if cls._pipeline is not None:
            return cls._pipeline
        if cls._load_failed:
            return None
        if cls._load_attempted:
            return cls._pipeline

        cls._load_attempted = True
        try:
            from transformers import pipeline  # local import: heavy, optional

            logger.info("Loading summarization model '%s'...", SUMMARY_MODEL_NAME)
            cls._pipeline = pipeline("summarization", model=SUMMARY_MODEL_NAME)
            logger.info("Summarization model loaded successfully.")
        except Exception as exc:
            cls._load_failed = True
            logger.error(
                "Failed to load summarization model '%s': %s. "
                "Falling back to extractive summaries.",
                SUMMARY_MODEL_NAME,
                exc,
            )
        return cls._pipeline

    def _transformer_summary(self, text: str) -> Optional[str]:
        """Attempt a BART-generated abstractive summary. Returns None on failure."""
        summarizer = self._get_pipeline()
        if summarizer is None:
            return None

        try:
            # BART has a token limit; truncate very long articles before inference.
            truncated = " ".join(text.split()[:1024])
            output = summarizer(
                truncated,
                max_length=200,
                min_length=60,
                do_sample=False,
            )
            summary = output[0]["summary_text"].strip()
            return summary or None
        except Exception as exc:
            logger.error("Transformer summarization failed: %s", exc)
            return None

    def _extractive_summary(self, text: str) -> str:
        """Fallback: take the first few sentences, trimmed to the word range."""
        sentences = [s.strip() for s in _SENTENCE_SPLIT_RE.split(text) if s.strip()]
        if not sentences:
            return ""

        selected: list[str] = []
        total_words = 0
        for sentence in sentences:
            if len(selected) >= MAX_SENTENCES:
                break
            selected.append(sentence)
            total_words += word_count(sentence)
            if len(selected) >= MIN_SENTENCES and total_words >= MIN_SUMMARY_WORDS:
                break

        summary = " ".join(selected)
        words = summary.split()
        if len(words) > MAX_SUMMARY_WORDS:
            summary = " ".join(words[:MAX_SUMMARY_WORDS])

        return summary

    def summarize(self, clean_content: str, article_url: str = "") -> SummaryResult:
        """Generate a summary for cleaned article content.

        Tries the transformer model first; falls back to extractive
        summarization on any failure. Never raises.
        """
        if not clean_content or not clean_content.strip():
            logger.warning(
                "Skipping summarization: no clean content for %s",
                article_url or "unknown URL",
            )
            return SummaryResult(
                summary="", word_count=0, character_count=0, reading_time=0, method="none"
            )

        summary_text = self._transformer_summary(clean_content)
        method = "transformer"

        if summary_text is None:
            summary_text = self._extractive_summary(clean_content)
            method = "extractive"

        if not summary_text:
            logger.error(
                "Summarization produced no output for %s; storing empty summary.",
                article_url or "unknown URL",
            )
            method = "none"

        logger.info(
            "Summary generated (%s) for %s: %d words.",
            method,
            article_url or "unknown URL",
            word_count(summary_text),
        )

        return SummaryResult(
            summary=summary_text,
            word_count=word_count(summary_text),
            character_count=character_count(summary_text),
            reading_time=reading_time_minutes(clean_content),
            method=method,
        )
