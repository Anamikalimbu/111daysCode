import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./utils/AuthContext";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#e2e8f0",
              border: "1px solid #1e3a8a",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#111827" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#111827" },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/register"
            element={<GuestRoute><Register /></GuestRoute>}
          />
          <Route
            path="/login"
            element={<GuestRoute><Login /></GuestRoute>}
          />
          <Route
            path="/forgot-password"
            element={<GuestRoute><ForgotPassword /></GuestRoute>}
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}