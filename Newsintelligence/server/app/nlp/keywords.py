"""
Keyword extraction using spaCy.

Extracts noun phrases and proper nouns, strips stopwords/punctuation,
ranks by frequency, and returns the top N deduplicated keywords.

Falls back to a lightweight regex + frequency approach if the spaCy
model isn't installed, so the pipeline never hard-fails on this step.
"""

from __future__ import annotations

import re
from collections import Counter

from app.nlp.utils import get_spacy_model
from app.utils.logger import get_logger

logger = get_logger(__name__)

TOP_N_KEYWORDS = 10
MIN_KEYWORD_LENGTH = 3

# A small stopword list for the fallback path (spaCy has its own, richer,
# list used automatically when the model is available).
_FALLBACK_STOPWORDS = {
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "her",
    "was", "one", "our", "out", "day", "get", "has", "him", "his", "how",
    "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did",
    "its", "let", "put", "say", "she", "too", "use", "that", "this",
    "with", "have", "from", "they", "will", "would", "there", "their",
    "what", "about", "which", "when", "make", "like", "time", "just",
    "into", "over", "also", "than", "then", "them", "were", "been",
}


class KeywordExtractor:
    """Extracts top keywords/keyphrases from cleaned article text."""

    def _extract_with_spacy(self, text: str) -> list[str]:
        """Primary path: noun chunks + proper nouns, frequency-ranked."""
        nlp = get_spacy_model()
        if nlp is None:
            return []

        doc = nlp(text)
        candidates: list[str] = []

        for chunk in doc.noun_chunks:
            phrase = " ".join(
                token.text
                for token in chunk
                if not token.is_stop and not token.is_punct and token.is_alpha
            ).strip()
            if len(phrase) >= MIN_KEYWORD_LENGTH:
                candidates.append(phrase)

        for ent in doc.ents:
            if ent.label_ in {"PERSON", "ORG", "GPE", "PRODUCT", "EVENT"}:
                candidates.append(ent.text.strip())

        return candidates

    def _extract_fallback(self, text: str) -> list[str]:
        """Fallback path: capitalized/frequent word runs via regex, used
        only when the spaCy model isn't available."""
        words = re.findall(r"\b[A-Za-z][A-Za-z\-]{2,}\b", text)
        filtered = [
            w for w in words if w.lower() not in _FALLBACK_STOPWORDS
        ]
        return filtered

    def extract(self, text: str, article_url: str = "", top_n: int = TOP_N_KEYWORDS) -> list[str]:
        """Extract the top `top_n` deduplicated keywords, ranked by frequency.

        Never raises: any failure results in an empty keyword list so
        the rest of the pipeline can continue.
        """
        if not text or not text.strip():
            logger.warning(
                "Skipping keyword extraction: no text for %s",
                article_url or "unknown URL",
            )
            return []

        try:
            candidates = self._extract_with_spacy(text)
            if not candidates:
                candidates = self._extract_fallback(text)
        except Exception as exc:
            logger.error(
                "Keyword extraction failed for %s: %s", article_url or "unknown", exc
            )
            candidates = self._extract_fallback(text)

        # Rank by frequency, but dedupe case-insensitively while preserving
        # the most common casing seen for each keyword.
        normalized_counts: Counter = Counter()
        display_form: dict[str, str] = {}
        for candidate in candidates:
            key = candidate.lower().strip()
            if not key or len(key) < MIN_KEYWORD_LENGTH:
                continue
            normalized_counts[key] += 1
            display_form.setdefault(key, candidate.strip())

        ranked = [
            display_form[key]
            for key, _count in normalized_counts.most_common(top_n)
        ]

        logger.info(
            "Extracted %d keywords for %s.", len(ranked), article_url or "unknown URL"
        )
        return ranked
