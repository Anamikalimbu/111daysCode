import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header className="border-b border-ink-700 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500/15 text-teal-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L4 5v6c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V5l-8-3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          SecureAuth
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <span className="hidden text-slate-400 sm:inline">{user?.name}</span>
              <Link to="/dashboard" className="text-slate-300 hover:text-teal-400 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md border border-ink-700 px-3 py-1.5 text-slate-300 hover:border-danger hover:text-danger transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-teal-400 transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-teal-500 px-3.5 py-1.5 font-medium text-ink-950 hover:bg-teal-400 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
