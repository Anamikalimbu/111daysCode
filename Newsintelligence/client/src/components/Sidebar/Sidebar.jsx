import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiHash,
  FiBarChart2,
  FiSearch,
  FiSettings,
} from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { NAV_ITEMS } from '../../utils/constants';

const ICONS = {
  dashboard: FiGrid,
  topics: FiHash,
  analytics: FiBarChart2,
  search: FiSearch,
  settings: FiSettings,
};

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 shrink-0 border-r border-void-line bg-paper transition-transform',
          'dark:bg-void md:sticky md:top-0 md:h-screen md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav
          aria-label="Primary"
          className="flex h-full flex-col gap-1 p-4 pt-6"
        >
          <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft dark:text-paper/40">
            Navigate
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-wire text-white'
                      : 'text-ink-soft hover:bg-paper-dim hover:text-ink dark:text-paper/60 dark:hover:bg-void-raised dark:hover:text-paper'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
