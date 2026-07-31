import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/** Coerce a date string/Date into a valid Date, or null if unusable. */
function toDate(value) {
  if (!value) return null;
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  return isValid(date) ? date : null;
}

/** e.g. "Jul 31, 2026" */
export function formatDate(value) {
  const date = toDate(value);
  return date ? format(date, 'MMM d, yyyy') : 'Unknown date';
}

/** e.g. "3 hours ago" */
export function formatRelativeTime(value) {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : 'Unknown time';
}

/** e.g. "4 min read" */
export function formatReadingTime(minutes) {
  if (!minutes || minutes < 1) return '< 1 min read';
  return `${minutes} min read`;
}

/** e.g. 1834 -> "1.8k" */
export function formatCompactNumber(value) {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
}

/** Clamp and format a -1..1 score as a signed percentage, e.g. "+42%" */
export function formatSignedPercent(score) {
  if (score === null || score === undefined) return '—';
  const pct = Math.round(score * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}
