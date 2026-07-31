import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { useHealth } from '../hooks/useArticles';

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { data: health, isLoading } = useHealth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-ink-soft dark:text-paper/50">
          Preferences for how you view the platform.
        </p>
      </div>

      <section className="rounded-2xl border border-void-line bg-white p-5 dark:bg-void-raised">
        <h2 className="font-display text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-paper/50">
          Currently using {theme} mode. Your choice is saved on this device.
        </p>
        <button
          type="button"
          onClick={toggleTheme}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-void-line px-4 py-2 text-sm font-medium hover:border-wire hover:text-wire"
        >
          {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          Switch to {isDark ? 'light' : 'dark'} mode
        </button>
      </section>

      <section className="rounded-2xl border border-void-line bg-white p-5 dark:bg-void-raised">
        <h2 className="font-display text-base font-semibold">Connection</h2>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft dark:text-paper/50">API base URL</dt>
            <dd className="font-mono text-xs">{apiBaseUrl}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft dark:text-paper/50">Status</dt>
            <dd className="font-mono text-xs">
              {isLoading
                ? 'Checking…'
                : health?.mongodb_connected
                  ? 'Connected'
                  : 'Database unreachable'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft dark:text-paper/50">Total articles</dt>
            <dd className="font-mono text-xs">{health?.total_articles ?? '—'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
