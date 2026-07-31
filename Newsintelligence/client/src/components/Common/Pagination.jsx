import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export default function Pagination({ page, totalPages, onPrev, onNext, onPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 pt-6"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Previous page"
        className="rounded-full p-2 transition-colors hover:bg-paper-dim disabled:opacity-30 dark:hover:bg-void-raised"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center">
            {showEllipsis && <span className="px-1 text-ink-soft">…</span>}
            <button
              type="button"
              onClick={() => onPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'h-8 w-8 rounded-full text-sm font-mono transition-colors',
                p === page
                  ? 'bg-wire text-white'
                  : 'hover:bg-paper-dim dark:hover:bg-void-raised'
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Next page"
        className="rounded-full p-2 transition-colors hover:bg-paper-dim disabled:opacity-30 dark:hover:bg-void-raised"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
