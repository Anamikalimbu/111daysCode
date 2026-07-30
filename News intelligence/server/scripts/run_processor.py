"""
Standalone entrypoint to run a batch of the NLP processing pipeline.

Usage:
    python -m scripts.run_processor
    python -m scripts.run_processor --batch-size 50
"""

from __future__ import annotations

import argparse
import sys

from app.services.processing_service import ProcessingService
from app.utils.logger import get_logger

logger = get_logger(__name__)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the NLP processing pipeline once.")
    parser.add_argument(
        "--batch-size",
        type=int,
        default=100,
        help="Max number of unprocessed articles to pull per run.",
    )
    args = parser.parse_args()

    service = ProcessingService()
    summary = service.run_processing_batch(batch_size=args.batch_size)

    print(
        f"Fetched: {summary['fetched']} | Updated: {summary['updated']} | "
        f"Failed: {summary['failed']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
