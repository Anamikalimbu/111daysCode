import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session
  const [authError, setAuthError] = useState(null);

  // On first load, see if a token already exists (e.g. from a previous
  // session) and try to hydrate the user from it.
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await authService.getProfile();
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const storeToken = (token, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  };

  const register = useCallback(async ({ name, email, password }) => {
    setAuthError(null);
    try {
      const data = await authService.register({ name, email, password });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setAuthError(null);
    try {
      const data = await authService.login({ email, password });
      storeToken(data.token, rememberMe);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your credentials.';
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the server call fails, clear local state so the user
      // isn't stuck in a "logged in" UI with a dead token.
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const data = await authService.getProfile();
    setUser(data.user);
    return data.user;
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    setAuthError,
    register,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;