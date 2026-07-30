"""
Human-readable topic name generation.

Given the articles in a cluster (each already carrying `keywords` and
`entities` from the Day 2 NLP pipeline), produces a short name like
"Artificial Intelligence", "Tesla Earnings", or "Nepal Politics" instead
of an opaque cluster ID.

This is rule-based (frequency + entity-type ranking), not model-generated
— it reuses the keyword/entity extraction already done per article rather
than making an additional model call per cluster.
"""

from __future__ import annotations

import re
from collections import Counter

from app.utils.logger import get_logger

logger = get_logger(__name__)

# Entity types that make good "anchors" for a topic name, in priority order.
_ANCHOR_ENTITY_TYPES = ["ORG", "EVENT", "PRODUCT", "GPE", "PERSON"]

MAX_TOPIC_WORDS = 4


def _title_case(text: str) -> str:
    """Title-case a phrase without mangling existing acronyms (e.g. 'AI', 'BBC')."""
    words = []
    for word in text.split():
        if word.isupper() and len(word) <= 5:
            words.append(word)  # preserve acronyms like AI, BBC, EU
        else:
            words.append(word[:1].upper() + word[1:])
    return " ".join(words)


def _collect_counts(articles: list[dict]) -> tuple[Counter, dict[str, Counter]]:
    """Tally keyword frequency and per-type entity frequency across a cluster."""
    keyword_counts: Counter = Counter()
    entity_counts: dict[str, Counter] = {t: Counter() for t in _ANCHOR_ENTITY_TYPES}

    for article in articles:
        for keyword in article.get("keywords") or []:
            keyword_counts[keyword.strip()] += 1

        entities = article.get("entities") or {}
        for entity_type in _ANCHOR_ENTITY_TYPES:
            for value in entities.get(entity_type, []):
                entity_counts[entity_type][value.strip()] += 1

    return keyword_counts, entity_counts


def _pick_anchor(entity_counts: dict[str, Counter], min_mentions: int = 2) -> str | None:
    """Pick the strongest entity anchor across all types, preferring
    higher-priority types on ties, requiring at least `min_mentions`
    (or falling back to any entity mentioned at all)."""
    best: tuple[int, int, str] | None = None  # (priority_rank_inverse, count, name)
    for priority, entity_type in enumerate(_ANCHOR_ENTITY_TYPES):
        counter = entity_counts[entity_type]
        if not counter:
            continue
        name, count = counter.most_common(1)[0]
        if count < min_mentions:
            continue
        rank_inverse = len(_ANCHOR_ENTITY_TYPES) - priority
        candidate = (rank_inverse, count, name)
        if best is None or candidate[1] > best[1] or (
            candidate[1] == best[1] and candidate[0] > best[0]
        ):
            best = candidate

    return best[2] if best else None


def _pick_modifier(keyword_counts: Counter, anchor: str | None) -> str | None:
    """Pick the top keyword that isn't redundant with the chosen anchor."""
    anchor_lower = (anchor or "").lower()
    for keyword, _count in keyword_counts.most_common(10):
        if not keyword:
            continue
        if anchor_lower and (
            keyword.lower() in anchor_lower or anchor_lower in keyword.lower()
        ):
            continue
        return keyword
    return None


def generate_topic_name(articles: list[dict]) -> str:
    """Generate a short, human-readable topic name for a cluster of articles.

    Strategy:
      1. Find the strongest recurring entity (org/event/product/place/person)
         as the anchor.
      2. Pair it with the top non-redundant keyword as a modifier
         (e.g. anchor "Tesla" + modifier "earnings" -> "Tesla Earnings").
      3. If no entity clears the mention threshold, fall back to the
         single top keyword/keyphrase.
      4. If nothing usable exists at all, fall back to a generic label.
    """
    if not articles:
        return "Untitled Topic"

    keyword_counts, entity_counts = _collect_counts(articles)
    anchor = _pick_anchor(entity_counts)

    if anchor:
        modifier = _pick_modifier(keyword_counts, anchor)
        name = f"{anchor} {modifier}" if modifier else anchor
    elif keyword_counts:
        top_keyword, _count = keyword_counts.most_common(1)[0]
        name = top_keyword
    else:
        name = f"Cluster of {len(articles)} Articles"

    words = name.split()
    if len(words) > MAX_TOPIC_WORDS:
        name = " ".join(words[:MAX_TOPIC_WORDS])

    name = re.sub(r"\s+", " ", name).strip()
    topic_name = _title_case(name)

    logger.info("Topic name generated for %d article(s): '%s'", len(articles), topic_name)
    return topic_name
