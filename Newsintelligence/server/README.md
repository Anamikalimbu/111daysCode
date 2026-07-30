# News Intelligence Platform — Backend

A modular Python backend that collects news articles from trusted RSS sources,
enriches them with full-article content, and stores them in MongoDB with a
FastAPI layer for retrieval.

> **Status:** Day 1 + Day 2 + Day 3 complete — scraping, storage, and API
> from Day 1; the NLP pipeline (cleaning, dedup, summarization, sentiment,
> keywords, entities) from Day 2; and AI story clustering, topic naming,
> related stories, trending topics, and an analytics engine from Day 3.

## Tech Stack

- Python 3.12+
- FastAPI + Uvicorn
- MongoDB + PyMongo
- Pydantic v2
- BeautifulSoup4 / Requests / Feedparser / Newspaper3k
- spaCy, Hugging Face Transformers, Sentence-Transformers, scikit-learn,
  TextBlob, VADER, NLTK
- HDBSCAN (preferred) / scikit-learn AgglomerativeClustering (fallback)
- python-dotenv

## Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   ├── routes.py           # GET /, /articles, /health
│   │   ├── news.py             # GET /processed, /summary/{id}, /sentiment, /keywords, /entities
│   │   ├── topics.py           # GET /topics, /topics/{cluster_id}, /trending, /related/{id}
│   │   └── analytics.py        # GET /analytics
│   ├── database/
│   │   └── connection.py       # Singleton MongoDB connection
│   ├── models/
│   │   └── article.py          # Article / ArticleCreate / ProcessedArticle models
│   ├── scraper/
│   │   ├── rss_scraper.py      # RSS feed parsing (BBC, CNN, Reuters, Guardian)
│   │   └── full_article.py     # Full-article content/author/image enrichment
│   ├── nlp/
│   │   ├── cleaner.py          # HTML/boilerplate/emoji removal -> clean_content
│   │   ├── duplicate_detector.py  # URL / title / TF-IDF cosine-similarity dedup
│   │   ├── summarizer.py       # BART abstractive summary, extractive fallback
│   │   ├── sentiment.py        # VADER + TextBlob -> final sentiment verdict
│   │   ├── keywords.py         # spaCy noun-chunk/entity keyword extraction
│   │   ├── entities.py         # spaCy NER (people, orgs, places, products...)
│   │   ├── clustering.py       # Sentence embeddings + HDBSCAN/Agglomerative clustering
│   │   ├── topic_generator.py  # Rule-based human-readable topic naming
│   │   ├── analytics.py        # Trending scores + source/sentiment/topic/keyword/entity analytics
│   │   ├── processor.py        # Orchestrates the Day 2 pipeline per batch
│   │   └── utils.py            # Shared text stats + cached spaCy model loader
│   ├── services/
│   │   ├── article_service.py      # Dedup-on-insert + scrape orchestration
│   │   ├── processing_service.py   # Fetch unprocessed -> run Day 2 pipeline -> $set update
│   │   ├── clustering_service.py   # Embed -> cluster -> name -> link -> score -> $set update
│   │   └── analytics_service.py    # Read-side queries for topics/trending/analytics endpoints
│   ├── utils/
│   │   ├── config.py           # Settings loaded from .env
│   │   └── logger.py           # Centralized logging config
│   └── main.py                  # FastAPI app entrypoint
│
├── scripts/
│   ├── run_scraper.py           # CLI: run a scrape-and-store cycle
│   ├── run_processor.py         # CLI: run an NLP processing batch
│   └── run_clustering.py        # CLI: run a clustering pass
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
   python -m spacy download en_core_web_sm
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

8. **Run the NLP processing pipeline** (cleans, deduplicates, summarizes,
   scores sentiment, and extracts keywords/entities for any unprocessed
   articles)

   ```bash
   python -m scripts.run_processor
   # or, to control how many articles are pulled per run:
   python -m scripts.run_processor --batch-size 50
   ```

   The first run downloads the `facebook/bart-large-cnn` summarization
   model from Hugging Face (a few GB) — this can take a while. If the
   model can't be loaded (no network, low memory, etc.) the pipeline
   automatically falls back to extractive summaries and logs why.

9. **Run the clustering pipeline** (groups processed articles into
   topics, names them, links related stories, and scores trending)

   ```bash
   python -m scripts.run_clustering
   ```

   The first run downloads the `all-MiniLM-L6-v2` sentence-embedding
   model. If it can't load, the clustering run logs the failure and
   skips clustering for that pass rather than crashing.

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable                     | Description                              |
|-------------------------------|-------------------------------------------|
| `MONGO_URI`                   | MongoDB connection string                |
| `MONGO_DB_NAME`                | Database name                            |
| `MONGO_ARTICLES_COLLECTION`     | Collection name for articles             |
| `MAX_ARTICLES_PER_SOURCE`        | Cap on articles pulled per RSS feed run  |
| `LOG_LEVEL`                        | Python logging level                    |

## Endpoints

| Method | Path                 | Description                                     |
|--------|----------------------|--------------------------------------------------|
| GET    | `/`                  | API welcome message                              |
| GET    | `/articles`          | List raw stored articles                         |
| GET    | `/health`            | API + MongoDB health, total article count        |
| GET    | `/processed`         | List processed (cleaned, enriched) articles      |
| GET    | `/summary/{id}`      | Title, AI summary, and reading time for one article |
| GET    | `/sentiment`         | Sentiment distribution (% positive/neutral/negative) |
| GET    | `/keywords`          | Trending keywords across processed articles      |
| GET    | `/entities`          | Most-mentioned people, organisations, countries  |
| GET    | `/topics`            | All discovered topics with article counts        |
| GET    | `/topics/{cluster_id}` | Topic name, member articles, summary, avg sentiment |
| GET    | `/trending`          | Top trending topics                              |
| GET    | `/related/{article_id}` | Top 5 most similar articles                   |
| GET    | `/analytics`         | Full analytics snapshot (sources, sentiment, topics, keywords, entities) |

## Roadmap

- [x] Day 1: Foundation — DB layer, model, scraper, storage, API, logging
- [x] Day 2: NLP pipeline — cleaning, duplicate detection, AI summarization,
      sentiment analysis, keyword extraction, named entity recognition
- [x] Day 3: AI story clustering, topic naming, related stories, trending
      topics, and a full analytics engine
- [ ] Day 4+: Search, pagination/filtering, scheduled scraping/processing/
      clustering, auth
