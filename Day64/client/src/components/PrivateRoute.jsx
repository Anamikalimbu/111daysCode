import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3b82f6",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "13px",
        }}
      >
        Authenticating…
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};