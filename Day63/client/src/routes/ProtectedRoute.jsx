import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

/**
 * ProtectedRoute — wraps routes that require authentication
 * Redirects to /login if not authenticated, saving the intended path
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * AdminRoute — wraps routes that require admin role
 * Redirects to /unauthorized if authenticated but not admin
 */
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

/**
 * PublicRoute — redirects authenticated users away from auth pages (login/register)
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/profile"} replace />;
  }

  return children;
}