import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="dot-grid-bg relative overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="token-text text-xs uppercase tracking-widest text-teal-500">Day 66 · #111DaysOfLearningForChange</p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">
          A complete authentication
          <br />
          system, built with MERN.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Registration, email verification, JWT sessions, password reset, and a protected dashboard 
          end to end.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400 transition-colors"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400 transition-colors"
              >
                Create an account
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-ink-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-teal-500 hover:text-teal-400 transition-colors"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
