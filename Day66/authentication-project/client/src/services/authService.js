import api from "./api";

export const register = (data) => api.post("/auth/register", data).then((res) => res.data);

export const login = (data) => api.post("/auth/login", data).then((res) => res.data);

export const logout = () => api.post("/auth/logout").then((res) => res.data);

export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`).then((res) => res.data);

export const resendVerification = (email) =>
  api.post("/auth/resend-verification", { email }).then((res) => res.data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email }).then((res) => res.data);

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password }).then((res) => res.data);

export const getProfile = () => api.get("/auth/profile").then((res) => res.data);
