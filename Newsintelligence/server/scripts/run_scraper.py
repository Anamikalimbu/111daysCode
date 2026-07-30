"""
Standalone entrypoint to run a full scrape-and-store cycle.

Usage:
    python -m scripts.run_scraper
    python -m scripts.run_scraper --no-enrich   # skip full-article fetch, RSS only
"""

from __future__ import annotations

import argparse
import sys

from app.services.article_service import ArticleService
from app.utils.logger import get_logger

logger = get_logger(__name__)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the news scraper once.")
    parser.add_argument(
        "--no-enrich",
        action="store_true",
        help="Skip fetching full article content (RSS-only fields).",
    )
    args = parser.parse_args()

    service = ArticleService()
    summary = service.run_scrape_and_store(enrich_full_content=not args.no_enrich)

    print(
        f"Found: {summary['found']} | Inserted: {summary['inserted']} | "
        f"Duplicates: {summary['duplicates']} | Failed: {summary['failed']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
