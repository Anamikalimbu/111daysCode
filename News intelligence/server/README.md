# News Intelligence Platform — Backend

A modular Python backend that collects news articles from trusted RSS sources,
enriches them with full-article content, and stores them in MongoDB with a
FastAPI layer for retrieval.

> **Status:** Day 1 complete — env setup, DB layer, data model, scraper,
> full-article enrichment, storage, API, and logging are all in place.

## Tech Stack

- Python 3.12+
- FastAPI + Uvicorn
- MongoDB + PyMongo
- Pydantic v2
- BeautifulSoup4 / Requests / Feedparser / Newspaper3k
- python-dotenv

## Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   └── routes.py          # GET /, /articles, /health
│   ├── database/
│   │   └── connection.py      # Singleton MongoDB connection
│   ├── models/
│   │   └── article.py         # Article / ArticleCreate Pydantic models
│   ├── scraper/
│   │   ├── rss_scraper.py     # RSS feed parsing (BBC, CNN, Reuters, Guardian)
│   │   └── full_article.py    # Full-article content/author/image enrichment
│   ├── services/
│   │   └── article_service.py # Dedup + storage + scrape orchestration
│   ├── utils/
│   │   ├── config.py          # Settings loaded from .env
│   │   └── logger.py          # Centralized logging config
│   └── main.py                 # FastAPI app entrypoint
│
├── scripts/
│   └── run_scraper.py          # CLI: run a scrape-and-store cycle
│
├── .env                 # Local environment variables (gitignored)
├── .env.example          # Template for environment variables
├── .gitignore
├── requirements.txt
└── README.md
```

## Setup

1. **Clone and enter the project**

   ```bash
   cd backend
   ```

2. **Create a virtual environment**

   ```bash
   python3.12 -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   # edit .env with your real MongoDB URI, etc.
   ```

5. **Run MongoDB** (locally via Docker, or use MongoDB Atlas)

   ```bash
   docker run -d -p 27017:27017 --name mongo mongo:7
   ```

6. **Run the API**

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Visit `http://localhost:8000/docs` for interactive API docs.

7. **Run a scrape** (in a separate terminal, with the venv active)

   ```bash
   python -m scripts.run_scraper
   # or, to skip full-article fetching and store RSS-only fields:
   python -m scripts.run_scraper --no-enrich
   ```

   This pulls the latest items from BBC News, CNN, Reuters, and The
   Guardian, fetches full article content for each, and stores new
   articles in MongoDB (duplicates by `article_url` are skipped).

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable                     | Description                              |
|-------------------------------|-------------------------------------------|
| `MONGO_URI`                   | MongoDB connection string                |
| `MONGO_DB_NAME`                | Database name                            |
| `MONGO_ARTICLES_COLLECTION`     | Collection name for articles             |
| `MAX_ARTICLES_PER_SOURCE`        | Cap on articles pulled per RSS feed run  |
| `LOG_LEVEL`                        | Python logging level                    |

## Endpoints (Day 1)

| Method | Path         | Description                                  |
|--------|--------------|-----------------------------------------------|
| GET    | `/`          | API welcome message                          |
| GET    | `/articles`  | List stored articles                         |
| GET    | `/health`    | API + MongoDB health, total article count    |

## Roadmap

- [x] Day 1: Foundation — DB layer, model, scraper, storage, API, logging
- [ ] Day 2+: Categorization, deduplication by content similarity, search,
      pagination/filtering, scheduled scraping, auth
