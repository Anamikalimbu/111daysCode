import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { formatCompactNumber } from '../../utils/formatters';

/** Animates from 0 to `value` on mount (skips animation for reduced motion). */
function useCountUp(value, duration = 700) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion || typeof value !== 'number') {
      setDisplay(value || 0);
      return;
    }

    let raf;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

function StatisticCard({ label, value, icon: Icon, accentClass = 'text-wire' }) {
  const animated = useCountUp(typeof value === 'number' ? value : null);
  const displayValue = typeof value === 'number' ? formatCompactNumber(animated) : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        'rounded-2xl border border-void-line bg-white p-4 dark:bg-void-raised',
        'flex items-center gap-3'
      )}
    >
      {Icon && (
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wire-soft dark:bg-wire/15',
            accentClass
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
          {label}
        </p>
        <p className="font-display text-2xl font-semibold tabular-nums">
          {displayValue}
        </p>
      </div>
    </motion.div>
  );
}

export default memo(StatisticCard);
