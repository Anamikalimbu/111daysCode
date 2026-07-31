import { FiX } from 'react-icons/fi';
import { SENTIMENT_OPTIONS, READING_TIME_OPTIONS } from '../../utils/constants';
import { cn } from '../../utils/cn';

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-paper/50">
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const value = option.value ?? option;
          const label = option.label ?? option;
          const isActive = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'border-wire bg-wire text-white'
                  : 'border-void-line hover:border-wire hover:text-wire'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Multi-select filter panel. Supports sentiment + reading time out of
 * the box, and optionally source/topic lists derived from the current
 * dataset (passed in by the caller since they're data-dependent).
 */
export default function FilterPanel({
  filters,
  onToggle,
  onClear,
  activeFilterCount = 0,
  availableSources = [],
  availableTopics = [],
}) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-void-line bg-white p-5 dark:bg-void-raised">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-wire"
          >
            <FiX className="h-3.5 w-3.5" />
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterGroup
        title="Sentiment"
        options={SENTIMENT_OPTIONS}
        selected={filters.sentiment}
        onToggle={(v) => onToggle('sentiment', v)}
      />

      <FilterGroup
        title="Reading time"
        options={READING_TIME_OPTIONS}
        selected={filters.readingTime}
        onToggle={(v) => onToggle('readingTime', v)}
      />

      {availableSources.length > 0 && (
        <FilterGroup
          title="Source"
          options={availableSources}
          selected={filters.source}
          onToggle={(v) => onToggle('source', v)}
        />
      )}

      {availableTopics.length > 0 && (
        <FilterGroup
          title="Topic"
          options={availableTopics}
          selected={filters.topic}
          onToggle={(v) => onToggle('topic', v)}
        />
      )}
    </div>
  );
}
