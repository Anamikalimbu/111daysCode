"""
Standalone entrypoint to run a story-clustering pass.

Usage:
    python -m scripts.run_clustering
"""

from __future__ import annotations

import sys

from app.services.clustering_service import ClusteringService
from app.utils.logger import get_logger

logger = get_logger(__name__)


def main() -> int:
    service = ClusteringService()
    summary = service.run_clustering()

    print(
        f"Articles considered: {summary['articles']} | "
        f"Clusters found: {summary['clusters']} | "
        f"Updated: {summary['updated']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
