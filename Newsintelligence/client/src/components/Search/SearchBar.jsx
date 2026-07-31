import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { getSentimentConfig } from '../../utils/sentiment';
import { cn } from '../../utils/cn';

/**
 * Global search input. Reports every keystroke via `onQueryChange` and
 * shows a `suggestions` dropdown (caller supplies matches, e.g. from
 * `useSearchAndFilter`). Enter or clicking a suggestion navigates.
 */
export default function SearchBar({
  query,
  onQueryChange,
  suggestions = [],
  placeholder = 'Search articles, topics, or sources…',
  autoFocus = false,
  className,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setOpen(false);
    navigate('/search');
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="global-search" className="sr-only">
          Search articles
        </label>
        <div className="relative">
          <FiSearch
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft dark:text-paper/40"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            autoFocus={autoFocus}
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-full border border-void-line bg-paper py-2.5 pl-10 pr-10 text-sm',
              'placeholder:text-ink-soft/60 focus:border-wire dark:bg-void dark:placeholder:text-paper/30'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-wire"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {open && query && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-void-line',
              'bg-white shadow-xl dark:bg-void-raised'
            )}
          >
            {suggestions.map((article) => {
              const sentimentConfig = getSentimentConfig(article.sentiment);
              return (
                <li key={article._id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate(`/article/${article._id}`);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-paper-dim dark:hover:bg-void"
                  >
                    <span
                      className={cn('h-1.5 w-1.5 shrink-0 rounded-full', sentimentConfig.dotClass)}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {article.title}
                      </span>
                      <span className="block truncate text-xs text-ink-soft dark:text-paper/50">
                        {article.source} · {article.topic_name || 'Uncategorized'}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
