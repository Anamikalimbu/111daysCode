import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import SearchBar from '../Search/SearchBar';
import { useTheme } from '../../hooks/useTheme';
import { useDebounce } from '../../hooks/useDebounce';
import { useProcessedArticles } from '../../hooks/useArticles';

export default function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);

  // Lightweight suggestion source for the navbar search (separate from
  // the full Search page, which uses useSearchAndFilter with more data).
  const { data } = useProcessedArticles({ limit: 100 });
  const suggestions = debouncedQuery
    ? (data?.articles || [])
        .filter((a) =>
          `${a.title} ${a.source} ${a.topic_name}`
            .toLowerCase()
            .includes(debouncedQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-void-line bg-paper/90 backdrop-blur dark:bg-void/90">
      <div className="flex items-center gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-paper-dim dark:hover:bg-void-raised md:hidden"
          aria-label="Open menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-void text-wire-dark dark:bg-wire dark:text-white">
            <span className="font-mono text-sm font-bold">W</span>
          </span>
          <span className="hidden font-display text-lg font-semibold sm:inline">
            Wire
          </span>
        </Link>

        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestions={suggestions}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 transition-colors hover:bg-paper-dim dark:hover:bg-void-raised"
          >
            {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            aria-label="Profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-void-line text-ink-soft hover:border-wire hover:text-wire dark:text-paper/60"
          >
            <FiUser className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchBar query={query} onQueryChange={setQuery} suggestions={suggestions} />
      </div>
    </header>
  );
}
