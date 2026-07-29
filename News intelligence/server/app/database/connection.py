"""
MongoDB connection layer.

Exposes a singleton `MongoConnection` so the whole app shares one
PyMongo client instead of opening a new connection per request/module.
"""

from __future__ import annotations

from typing import Optional

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, PyMongoError

from app.utils.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class MongoConnection:
    """Singleton wrapper around a PyMongo client.

    Guarantees only one MongoClient (and therefore one connection pool)
    exists per process, regardless of how many times/places it's used.
    """

    _instance: Optional["MongoConnection"] = None

    _client: Optional[MongoClient] = None
    _db: Optional[Database] = None

    def __new__(cls) -> "MongoConnection":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._connect()
        return cls._instance

    def _connect(self) -> None:
        """Establish the MongoDB connection and verify it's reachable."""
        settings = get_settings()
        try:
            logger.info("Connecting to MongoDB...")
            self._client = MongoClient(
                settings.mongo_uri,
                serverSelectionTimeoutMS=5000,
            )
            # Force a round-trip to confirm the server is actually reachable.
            self._client.admin.command("ping")
            self._db = self._client[settings.mongo_db_name]
            logger.info(
                "Connected to MongoDB database '%s' successfully.",
                settings.mongo_db_name,
            )
        except ConnectionFailure as exc:
            logger.error("Failed to connect to MongoDB: %s", exc)
            self._client = None
            self._db = None
        except PyMongoError as exc:
            logger.error("Unexpected MongoDB error during connection: %s", exc)
            self._client = None
            self._db = None

    def is_connected(self) -> bool:
        """Check whether the MongoDB connection is currently alive."""
        if self._client is None:
            return False
        try:
            self._client.admin.command("ping")
            return True
        except PyMongoError:
            return False

    def get_database(self) -> Optional[Database]:
        """Return the active database handle, or None if disconnected."""
        if self._db is None:
            logger.warning("Requested database handle but no active connection.")
        return self._db

    def get_collection(self, name: Optional[str] = None) -> Optional[Collection]:
        """Return a collection handle.

        Args:
            name: Collection name. Defaults to the configured articles
                collection if omitted.
        """
        settings = get_settings()
        collection_name = name or settings.mongo_articles_collection
        db = self.get_database()
        if db is None:
            return None
        return db[collection_name]

    def close(self) -> None:
        """Close the underlying MongoDB client connection."""
        if self._client is not None:
            self._client.close()
            logger.info("MongoDB connection closed.")
            self._client = None
            self._db = None


def get_mongo_connection() -> MongoConnection:
    """Return the singleton MongoConnection instance."""
    return MongoConnection()


def get_articles_collection() -> Optional[Collection]:
    """Convenience accessor for the configured articles collection."""
    return get_mongo_connection().get_collection()
