import { Link } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <FiCompass className="h-10 w-10 text-ink-soft dark:text-paper/40" />
      <p className="font-mono text-sm uppercase tracking-wide text-ink-soft dark:text-paper/50">
        404
      </p>
      <h1 className="font-display text-3xl font-semibold">
        This page isn&rsquo;t on the wire.
      </h1>
      <p className="max-w-sm text-sm text-ink-soft dark:text-paper/60">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-wire px-5 py-2.5 text-sm font-medium text-white hover:bg-wire/90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
