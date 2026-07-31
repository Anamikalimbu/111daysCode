# Wire — News Intelligence Platform (Frontend)

A React 19 + Vite dashboard for the News Intelligence Platform backend —
browse AI-processed news, read summaries, check sentiment, explore
clustered topics, and dig into analytics.

## Design

"Wire desk" identity: a paper/ink base with a cobalt-blue signature
accent, serif display type (Fraunces) paired with a grotesk body face
(Inter) and a mono face (IBM Plex Mono) for data/timestamps — an
editorial, wire-service feel rather than a generic dashboard template.
The signature element is the scrolling ticker strip of trending topics
under the navbar.

## Tech Stack

- React 19 + Vite
- React Router DOM (route-based code splitting via `React.lazy`)
- Tailwind CSS v4 (CSS-based `@theme` tokens, class-based dark mode)
- Axios + TanStack Query (caching, refetching, loading/error states)
- Recharts (analytics charts)
- Framer Motion (page transitions, hover effects, staggered reveals)
- React Icons, date-fns

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar/       # Navbar.jsx, WireTicker.jsx (signature element)
│   │   ├── Sidebar/      # Sidebar.jsx (active-route highlighting)
│   │   ├── Cards/        # NewsCard, TopicCard, StatisticCard, SentimentBadge, KeywordChip
│   │   ├── Charts/       # 6 Recharts wrappers + ChartCard + chartTheme
│   │   ├── Search/       # SearchBar (live suggestions)
│   │   ├── Filters/      # FilterPanel (multi-select)
│   │   ├── Loader/       # LoadingSpinner
│   │   └── Common/       # EmptyState, ErrorState, Pagination, Skeleton, PageTransition
│   ├── pages/            # Dashboard, ArticleDetails, Topics, TopicDetails, Analytics, SearchResults, Settings, NotFound
│   ├── services/         # api.js (axios + typed API functions), endpoints.js
│   ├── hooks/            # useArticles, useTopics, useAnalytics, useSearch, useDebounce, usePagination, useTheme
│   ├── context/           # ThemeContext (dark mode + localStorage)
│   ├── utils/             # cn, formatters, sentiment config, constants
│   ├── layouts/            # MainLayout (Sidebar + Navbar + Ticker + Outlet)
│   ├── App.jsx              # Router, React Query provider, lazy routes
│   └── main.jsx
├── .env.example
└── package.json
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the API base URL**

   ```bash
   cp .env.example .env
   # edit .env if your backend isn't at http://localhost:8000
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173`. The backend (see `../backend/README.md`)
   should be running for data to appear — every page degrades to a
   friendly empty/error state if it isn't.

4. **Lint / format / build**

   ```bash
   npm run lint
   npm run format
   npm run build
   npm run preview   # serve the production build locally
   ```

## Backend dependency: one added endpoint

The backend's `/summary/{id}` only returns title/summary/reading_time.
The Article Details page needs the full processed article (content,
all entities, all sentiment scores, related articles), so a
`GET /article/{id}` endpoint was added to `backend/app/api/news.py` —
it reuses the same `ProcessingService.get_article_by_id` that
`/summary/{id}` already used, just returning the whole document. No
other backend changes were needed for this frontend.

## Known limitations / next steps

- **Search & filtering are client-side.** The backend doesn't expose a
  full-text search or filter query endpoint yet, so `useSearchAndFilter`
  fetches a bounded batch of recent processed articles (200) and
  filters in the browser. Fine at dashboard scale; a dedicated
  `/search` backend endpoint would be the right next step if the
  article catalog grows much larger.
- **Article activity chart** buckets by day from articles already
  loaded on the Analytics page (150 most recent) rather than a
  dedicated time-series endpoint.
- Dev dependencies currently report some `npm audit` advisories
  (mostly in build tooling, not runtime code) — run `npm audit` and
  update as needed before production deployment.
