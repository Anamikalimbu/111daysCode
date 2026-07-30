"""
Application settings, loaded once from environment variables / .env.

Centralizing config here means no module reaches into `os.environ`
directly, and there's a single place to see every setting the app uses.
"""

from __future__ import annotations

from functools import lru_cache

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env into the process environment before Settings() reads it.
load_dotenv()


class Settings(BaseSettings):
    """Typed application settings sourced from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- MongoDB ---
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "news_intelligence"
    mongo_articles_collection: str = "articles"

    # --- Scraper behavior ---
    request_timeout_seconds: int = 10
    max_articles_per_source: int = 20
    scraper_user_agent: str = "NewsIntelligenceBot/1.0 (+https://example.com/bot)"

    # --- API ---
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    # --- Logging ---
    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (loaded once per process)."""
    return Settings()
