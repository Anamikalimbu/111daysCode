import { useState } from 'react';
import SearchBar from '../components/Search/SearchBar';
import FilterPanel from '../components/Filters/FilterPanel';
import NewsCard from '../components/Cards/NewsCard';
import { NewsCardSkeleton } from '../components/Common/Skeleton';
import EmptyState from '../components/Common/EmptyState';
import ErrorState from '../components/Common/ErrorState';
import Pagination from '../components/Common/Pagination';
import { useSearchAndFilter } from '../hooks/useSearch';
import { usePagination } from '../hooks/usePagination';
import { FiFilter, FiX } from 'react-icons/fi';

const PAGE_SIZE = 9;

export default function SearchResults() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    query,
    setQuery,
    filters,
    toggleFilter,
    clearFilters,
    activeFilterCount,
    results,
    suggestions,
    availableSources,
    availableTopics,
    isLoading,
    isError,
  } = useSearchAndFilter();

  const { page, setPage, totalPages, pageItems, nextPage, prevPage } =
    usePagination(results, PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Search</h1>
        <p className="text-sm text-ink-soft dark:text-paper/50">
          Search by title, keyword, topic, or source. Combine with filters
          to narrow results.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          suggestions={suggestions}
          autoFocus
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-void-line px-4 py-2.5 text-sm font-medium hover:border-wire lg:hidden"
        >
          {filtersOpen ? <FiX className="h-4 w-4" /> : <FiFilter className="h-4 w-4" />}
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-wire px-1.5 py-0.5 text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className={filtersOpen ? 'block' : 'hidden lg:block'}>
          <FilterPanel
            filters={filters}
            onToggle={toggleFilter}
            onClear={clearFilters}
            activeFilterCount={activeFilterCount}
            availableSources={availableSources}
            availableTopics={availableTopics}
          />
        </div>

        <div>
          {isError ? (
            <ErrorState />
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title={query ? 'No matches found' : 'Start typing to search'}
              message={
                query
                  ? 'Try a different term, or clear your filters.'
                  : 'Search across every processed article by title, keyword, topic, or source.'
              }
            />
          ) : (
            <>
              <p className="mb-4 text-xs text-ink-soft dark:text-paper/40">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {pageItems.map((article) => (
                  <NewsCard key={article._id} article={article} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={prevPage}
                onNext={nextPage}
                onPage={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
