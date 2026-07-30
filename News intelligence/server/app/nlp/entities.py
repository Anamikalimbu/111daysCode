"""
Named entity recognition using spaCy.

Note on GPE: spaCy's default `en_core_web_sm` model does not distinguish
between countries and cities — both are labeled `GPE` (geopolitical
entity). Rather than fake a split, this module surfaces `GPE` as-is;
splitting into country/city would require a gazetteer lookup, which can
be added later as an enhancement.
"""

from __future__ import annotations

from app.nlp.utils import get_spacy_model
from app.utils.logger import get_logger

logger = get_logger(__name__)

# spaCy label -> our output key. Only entity types the platform cares about.
_ENTITY_LABEL_MAP = {
    "PERSON": "PERSON",
    "ORG": "ORG",
    "GPE": "GPE",  # countries, cities, states
    "PRODUCT": "PRODUCT",
    "EVENT": "EVENT",
    "DATE": "DATE",
}

_MAX_ENTITIES_PER_TYPE = 15


class EntityExtractor:
    """Extracts named entities (people, orgs, places, products, events, dates)."""

    def extract(self, text: str, article_url: str = "") -> dict[str, list[str]]:
        """Extract named entities grouped by type.

        Never raises: any failure results in an empty entity dict so the
        rest of the pipeline can continue.
        """
        if not text or not text.strip():
            logger.warning(
                "Skipping entity extraction: no text for %s",
                article_url or "unknown URL",
            )
            return {}

        nlp = get_spacy_model()
        if nlp is None:
            logger.warning(
                "spaCy model unavailable; skipping entity extraction for %s",
                article_url or "unknown URL",
            )
            return {}

        try:
            doc = nlp(text)
        except Exception as exc:
            logger.error(
                "Entity extraction failed for %s: %s", article_url or "unknown", exc
            )
            return {}

        entities: dict[str, list[str]] = {}
        seen_per_type: dict[str, set] = {}

        for ent in doc.ents:
            output_key = _ENTITY_LABEL_MAP.get(ent.label_)
            if output_key is None:
                continue

            text_value = ent.text.strip()
            if not text_value:
                continue

            normalized = text_value.lower()
            seen = seen_per_type.setdefault(output_key, set())
            if normalized in seen:
                continue

            bucket = entities.setdefault(output_key, [])
            if len(bucket) >= _MAX_ENTITIES_PER_TYPE:
                continue

            bucket.append(text_value)
            seen.add(normalized)

        total = sum(len(v) for v in entities.values())
        logger.info(
            "Extracted %d entities across %d types for %s.",
            total,
            len(entities),
            article_url or "unknown URL",
        )
        return entities
