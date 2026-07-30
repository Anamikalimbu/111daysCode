"""
Trending topic scoring (Part 5) and the analytics engine (Part 6).

Deliberately pure/stateless: every function here takes plain
lists-of-dicts (already fetched from MongoDB by the caller) and returns
plain dicts. That keeps this module unit-test friendly and reusable —
no MongoDB connection required to test the math.
"""

from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone

from app.utils.logger import get_logger

logger = get_logger(__name__)

RECENT_WINDOW_HOURS = 48
TOP_KEYWORDS_DEFAULT = 20
TOP_ENTITIES_DEFAULT = 10

# Trending score component weights. Kept as named constants so the
# formula's assumptions are easy to see and tune.
_WEIGHT_RECENT_ACTIVITY = 0.4
_WEIGHT_CLUSTER_SIZE = 0.3
_WEIGHT_PUBLICATION_FREQUENCY = 0.2
_WEIGHT_SENTIMENT_INTENSITY = 0.1

# A best-effort, non-exhaustive list used only to split GPE entities into
# "countries" vs. "cities" for entity analytics — spaCy's default model
# doesn't make this distinction itself. Unrecognized GPE values are
# assumed to be cities, which is a heuristic, not a guarantee.
_COMMON_COUNTRIES = {
    "united states", "usa", "us", "united kingdom", "uk", "china", "india",
    "russia", "germany", "france", "japan", "brazil", "canada", "australia",
    "italy", "spain", "mexico", "south korea", "north korea", "nepal",
    "pakistan", "bangladesh", "indonesia", "nigeria", "egypt", "turkey",
    "iran", "iraq", "israel", "saudi arabia", "ukraine", "poland",
    "netherlands", "belgium", "sweden", "norway", "switzerland", "austria",
    "greece", "portugal", "ireland", "argentina", "chile", "colombia",
    "peru", "venezuela", "south africa", "kenya", "ethiopia", "vietnam",
    "thailand", "philippines", "malaysia", "singapore", "new zealand",
    "denmark", "finland", "czech republic", "hungary", "romania",
    "afghanistan", "syria", "yemen", "qatar", "united arab emirates", "uae",
}


def _parse_timestamp(article: dict) -> datetime | None:
    """Best-effort extraction of a comparable timestamp from an article."""
    for field_name in ("published_date", "scraped_at", "processed_at"):
        value = article.get(field_name)
        if isinstance(value, datetime):
            return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return None


class TrendingCalculator:
    """Computes a trending score per cluster from recency, size, and
    publication-frequency signals."""

    def compute_cluster_scores(
        self,
        cluster_articles: dict[str, list[dict]],
        now: datetime | None = None,
    ) -> dict[str, float]:
        """Compute a 0..1 trending score for each cluster.

        Args:
            cluster_articles: cluster_id -> list of its member article dicts
                (each should have a timestamp field and, ideally, sentiment_score).
            now: reference time for "recent" calculations (defaults to UTC now).
        """
        now = now or datetime.now(timezone.utc)
        window_start = now - timedelta(hours=RECENT_WINDOW_HOURS)

        raw_scores: dict[str, dict[str, float]] = {}
        for cluster_id, articles in cluster_articles.items():
            timestamps = [t for t in (_parse_timestamp(a) for a in articles) if t]
            recent_count = sum(1 for t in timestamps if t >= window_start)
            publication_frequency = recent_count / RECENT_WINDOW_HOURS if timestamps else 0.0

            sentiment_scores = [
                a.get("sentiment_score")
                for a in articles
                if isinstance(a.get("sentiment_score"), (int, float))
            ]
            sentiment_intensity = (
                sum(abs(s) for s in sentiment_scores) / len(sentiment_scores)
                if sentiment_scores
                else 0.0
            )

            raw_scores[cluster_id] = {
                "recent_activity": float(recent_count),
                "cluster_size": float(len(articles)),
                "publication_frequency": publication_frequency,
                "sentiment_intensity": sentiment_intensity,
            }

        return self._normalize_and_weight(raw_scores)

    @staticmethod
    def _normalize_and_weight(raw_scores: dict[str, dict[str, float]]) -> dict[str, float]:
        """Min-max normalize each component across clusters, then combine
        with the module's weight constants."""
        if not raw_scores:
            return {}

        components = ["recent_activity", "cluster_size", "publication_frequency", "sentiment_intensity"]
        maxima = {c: max((v[c] for v in raw_scores.values()), default=0.0) for c in components}

        weights = {
            "recent_activity": _WEIGHT_RECENT_ACTIVITY,
            "cluster_size": _WEIGHT_CLUSTER_SIZE,
            "publication_frequency": _WEIGHT_PUBLICATION_FREQUENCY,
            "sentiment_intensity": _WEIGHT_SENTIMENT_INTENSITY,
        }

        final_scores: dict[str, float] = {}
        for cluster_id, values in raw_scores.items():
            score = 0.0
            for component in components:
                max_value = maxima[component]
                normalized = (values[component] / max_value) if max_value > 0 else 0.0
                score += normalized * weights[component]
            final_scores[cluster_id] = round(score, 4)

        return final_scores


def compute_source_analytics(articles: list[dict]) -> dict:
    """Articles-per-source counts and a popularity ranking."""
    counts = Counter(a.get("source", "Unknown") for a in articles)
    ranked = counts.most_common()
    return {
        "articles_per_source": dict(ranked),
        "most_popular_source": ranked[0][0] if ranked else None,
    }


def compute_sentiment_analytics(articles: list[dict]) -> dict:
    """Sentiment distribution as percentages."""
    counts = Counter(a.get("sentiment") for a in articles if a.get("sentiment"))
    total = sum(counts.values())
    if total == 0:
        return {"positive": 0, "neutral": 0, "negative": 0}
    return {
        "positive": round(counts.get("positive", 0) / total * 100),
        "neutral": round(counts.get("neutral", 0) / total * 100),
        "negative": round(counts.get("negative", 0) / total * 100),
    }


def compute_topic_analytics(articles: list[dict]) -> dict:
    """Cluster/topic-level stats: total clusters, largest cluster, most active topic."""
    by_cluster: dict[str, list[dict]] = defaultdict(list)
    for article in articles:
        cluster_id = article.get("cluster_id")
        if cluster_id:
            by_cluster[cluster_id].append(article)

    if not by_cluster:
        return {"total_clusters": 0, "largest_cluster": None, "most_active_topic": None}

    largest_id, largest_members = max(by_cluster.items(), key=lambda pair: len(pair[1]))
    most_active_id, most_active_members = max(
        by_cluster.items(),
        key=lambda pair: max((a.get("trending_score") or 0.0) for a in pair[1]),
    )

    return {
        "total_clusters": len(by_cluster),
        "largest_cluster": {
            "cluster_id": largest_id,
            "topic_name": largest_members[0].get("topic_name"),
            "size": len(largest_members),
        },
        "most_active_topic": {
            "cluster_id": most_active_id,
            "topic_name": most_active_members[0].get("topic_name"),
            "trending_score": max((a.get("trending_score") or 0.0) for a in most_active_members),
        },
    }


def compute_keyword_analytics(articles: list[dict], top_n: int = TOP_KEYWORDS_DEFAULT) -> list[dict]:
    """Top N keywords by frequency across all articles."""
    counts: Counter = Counter()
    for article in articles:
        for keyword in article.get("keywords") or []:
            counts[keyword] += 1
    return [{"keyword": k, "count": c} for k, c in counts.most_common(top_n)]


def compute_entity_analytics(articles: list[dict], top_n: int = TOP_ENTITIES_DEFAULT) -> dict:
    """Most-mentioned people, organisations, countries, and cities.

    See the `_COMMON_COUNTRIES` note above: country/city split is a
    best-effort heuristic since the NER model only outputs a generic GPE.
    """
    people: Counter = Counter()
    orgs: Counter = Counter()
    countries: Counter = Counter()
    cities: Counter = Counter()

    for article in articles:
        entities = article.get("entities") or {}
        for name in entities.get("PERSON", []):
            people[name] += 1
        for name in entities.get("ORG", []):
            orgs[name] += 1
        for name in entities.get("GPE", []):
            if name.lower() in _COMMON_COUNTRIES:
                countries[name] += 1
            else:
                cities[name] += 1

    def top(counter: Counter) -> list[dict]:
        return [{"name": name, "count": count} for name, count in counter.most_common(top_n)]

    return {
        "people": top(people),
        "organisations": top(orgs),
        "countries": top(countries),
        "cities": top(cities),
    }


def get_trending_topics(articles: list[dict], top_n: int = 10) -> list[dict]:
    """Group articles by cluster and return the top N by trending_score.

    Every article in a cluster carries the same `trending_score` (it's
    computed per-cluster and copied onto members), so we take the max
    per cluster as the representative value.
    """
    by_cluster: dict[str, list[dict]] = defaultdict(list)
    for article in articles:
        cluster_id = article.get("cluster_id")
        if cluster_id:
            by_cluster[cluster_id].append(article)

    topics = []
    for cluster_id, members in by_cluster.items():
        topics.append(
            {
                "cluster_id": cluster_id,
                "topic": members[0].get("topic_name"),
                "articles": len(members),
                "trending_score": max((m.get("trending_score") or 0.0) for m in members),
            }
        )

    topics.sort(key=lambda t: t["trending_score"], reverse=True)
    return topics[:top_n]


def compute_full_analytics(articles: list[dict], total_articles_all_time: int) -> dict:
    """Assemble the complete /analytics response from a set of processed articles."""
    topic_stats = compute_topic_analytics(articles)
    return {
        "total_articles": total_articles_all_time,
        "total_clusters": topic_stats["total_clusters"],
        "source_distribution": compute_source_analytics(articles),
        "sentiment_distribution": compute_sentiment_analytics(articles),
        "topic_analytics": topic_stats,
        "trending_topics": get_trending_topics(articles),
        "top_keywords": compute_keyword_analytics(articles),
        "top_entities": compute_entity_analytics(articles),
    }
