/**
 * Combine class name fragments, skipping falsy values.
 * `cn('a', condition && 'b', 'c')` -> 'a b c' or 'a c'
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
