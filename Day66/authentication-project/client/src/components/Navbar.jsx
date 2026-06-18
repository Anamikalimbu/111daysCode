import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-slate-100">
          <ShieldCheck size={20} className="text-signal-400" />
          <span className="font-display text-base font-semibold tracking-tight">SecureAuth</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-400 sm:inline">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-md border border-ink-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-danger-500/50 hover:text-danger-400"
              >
                <LogOut size={14} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-slate-100">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-signal-500 px-3.5 py-1.5 text-sm font-medium text-ink-950 transition-colors hover:bg-signal-400"
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