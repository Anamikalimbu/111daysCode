"""
Centralized logging configuration for the News Intelligence Platform.

Every module should call `get_logger(__name__)` instead of configuring
its own handlers, so log formatting stays consistent across the app.
"""

from __future__ import annotations

import logging
import os
import sys

_CONFIGURED = False


def _configure_root_logger() -> None:
    """Configure the root logger once, with a readable timestamped format."""
    global _CONFIGURED
    if _CONFIGURED:
        return

    log_level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    log_level = getattr(logging, log_level_name, logging.INFO)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.addHandler(handler)

    # Quiet down noisy third-party loggers unless we're in DEBUG mode.
    if log_level > logging.DEBUG:
        logging.getLogger("urllib3").setLevel(logging.WARNING)
        logging.getLogger("newspaper").setLevel(logging.WARNING)
        logging.getLogger("pymongo").setLevel(logging.WARNING)

    _CONFIGURED = True


def get_logger(name: str) -> logging.Logger:
    """Return a configured logger for the given module name.

    Usage:
        from app.utils.logger import get_logger
        logger = get_logger(__name__)
    """
    _configure_root_logger()
    return logging.getLogger(name)
