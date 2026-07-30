"""
Sentiment analysis using both VADER and TextBlob.

VADER is treated as the primary signal (it's tuned for news/social text
and gives positive/neutral/negative proportions directly). TextBlob's
polarity is used as a cross-check; disagreements between the two are
logged rather than silently discarded.
"""

from __future__ import annotations

from dataclasses import dataclass

from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from app.utils.logger import get_logger

logger = get_logger(__name__)

POSITIVE_THRESHOLD = 0.05
NEGATIVE_THRESHOLD = -0.05

_vader_analyzer = SentimentIntensityAnalyzer()


@dataclass
class SentimentResult:
    """Final sentiment output for a single article."""

    sentiment: str  # "positive" | "neutral" | "negative"
    sentiment_score: float  # VADER compound score, -1..1
    positive_score: float
    neutral_score: float
    negative_score: float


def _label_from_compound(compound: float) -> str:
    """Map a VADER compound score to a positive/neutral/negative label."""
    if compound >= POSITIVE_THRESHOLD:
        return "positive"
    if compound <= NEGATIVE_THRESHOLD:
        return "negative"
    return "neutral"


def _label_from_polarity(polarity: float) -> str:
    """Map a TextBlob polarity score to a positive/neutral/negative label."""
    if polarity > POSITIVE_THRESHOLD:
        return "positive"
    if polarity < NEGATIVE_THRESHOLD:
        return "negative"
    return "neutral"


class SentimentAnalyzer:
    """Combines VADER and TextBlob to produce a final sentiment verdict."""

    def analyze(self, text: str, article_url: str = "") -> SentimentResult:
        """Run both sentiment engines and return the combined result.

        Never raises: analysis failure results in a neutral, zero-scored
        result so the pipeline can continue.
        """
        if not text or not text.strip():
            logger.warning(
                "Skipping sentiment analysis: no text for %s",
                article_url or "unknown URL",
            )
            return SentimentResult(
                sentiment="neutral",
                sentiment_score=0.0,
                positive_score=0.0,
                neutral_score=0.0,
                negative_score=0.0,
            )

        try:
            vader_scores = _vader_analyzer.polarity_scores(text)
        except Exception as exc:
            logger.error("VADER sentiment analysis failed for %s: %s", article_url, exc)
            vader_scores = {"compound": 0.0, "pos": 0.0, "neu": 1.0, "neg": 0.0}

        try:
            textblob_polarity = TextBlob(text).sentiment.polarity
        except Exception as exc:
            logger.error("TextBlob sentiment analysis failed for %s: %s", article_url, exc)
            textblob_polarity = 0.0

        vader_label = _label_from_compound(vader_scores["compound"])
        textblob_label = _label_from_polarity(textblob_polarity)

        if vader_label != textblob_label:
            logger.info(
                "Sentiment engines disagree for %s: VADER=%s, TextBlob=%s. "
                "Using VADER as the final verdict.",
                article_url or "unknown URL",
                vader_label,
                textblob_label,
            )

        result = SentimentResult(
            sentiment=vader_label,
            sentiment_score=round(vader_scores["compound"], 4),
            positive_score=round(vader_scores["pos"], 4),
            neutral_score=round(vader_scores["neu"], 4),
            negative_score=round(vader_scores["neg"], 4),
        )

        logger.info(
            "Sentiment calculated for %s: %s (score=%.4f)",
            article_url or "unknown URL",
            result.sentiment,
            result.sentiment_score,
        )
        return result
