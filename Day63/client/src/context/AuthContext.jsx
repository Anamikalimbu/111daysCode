import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const TOKEN_KEY = "rbac_token";
const USER_KEY = "rbac_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // ─── Persist user to localStorage ─────────────────────────────────────────
  const persistUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  // ─── Verify token on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setInitializing(false);
        setLoading(false);
        return;
      }
      try {
        const { data } = await authService.getProfile();
        persistUser(data.user);
      } catch {
        // Token invalid — clear everything
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setInitializing(false);
        setLoading(false);
      }
    };
    verifyAuth();
  }, [persistUser]);

  // ─── Register ──────────────────────────────────────────────────────────────
  const register = async (name, email, password, role = "user") => {
    setLoading(true);
    try {
      const { data } = await authService.register({ name, email, password, role });
      localStorage.setItem(TOKEN_KEY, data.token);
      persistUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authService.login({ email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      persistUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // ─── Update local user state (after profile update) ───────────────────────
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ─── Computed Properties ───────────────────────────────────────────────────
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  const value = {
    user,
    loading,
    initializing,
    isAuthenticated,
    isAdmin,
    isUser,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;