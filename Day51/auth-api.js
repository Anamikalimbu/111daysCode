// ============================================================
// AUTH API CLIENT
// Base URL: https://api.example.com/v2/auth
// ============================================================

const BASE_URL = "https://api.example.com/v2/auth";

// ------------------------------------------------------------
// TOKEN STORAGE HELPERS
// ------------------------------------------------------------

function saveTokens(accessToken, refreshToken) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// ------------------------------------------------------------
// CORE FETCH HELPER
// ------------------------------------------------------------

async function authFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Attach Authorization header if access token exists
  const token = getAccessToken();
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "API request failed");
    error.status = response.status;
    error.code = data.code || null;
    throw error;
  }

  return data;
}

// ------------------------------------------------------------
// 1. REGISTER
// POST /register
// ------------------------------------------------------------

/**
 * Register a new user account.
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @param {string} [fullName]
 * @returns {Promise<{user, access_token, refresh_token, expires_in}>}
 */
async function register(email, password, username, fullName = "") {
  const body = { email, password, username };
  if (fullName) body.full_name = fullName;

  const data = await authFetch("/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ------------------------------------------------------------
// 2. LOGIN
// POST /login
// ------------------------------------------------------------

/**
 * Authenticate with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user, access_token, refresh_token, expires_in}>}
 */
async function login(email, password) {
  const data = await authFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ------------------------------------------------------------
// 3. GET PROFILE
// GET /me
// ------------------------------------------------------------

/**
 * Fetch the currently authenticated user's profile.
 * Requires a valid access token in storage.
 * @returns {Promise<{id, email, username, full_name, created_at, last_login}>}
 */
async function getProfile() {
  return await authFetch("/me", {
    method: "GET",
  });
}

// ------------------------------------------------------------
// 4. REFRESH TOKEN
// POST /refresh
// ------------------------------------------------------------

/**
 * Obtain a new access token using the stored refresh token.
 * Automatically updates stored tokens.
 * @returns {Promise<{access_token, refresh_token, expires_in}>}
 */
async function refreshToken() {
  const storedRefreshToken = getRefreshToken();

  if (!storedRefreshToken) {
    throw new Error("No refresh token found. Please log in again.");
  }

  const data = await authFetch("/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: storedRefreshToken }),
  });

  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ------------------------------------------------------------
// 5. LOGOUT
// POST /logout
// ------------------------------------------------------------

/**
 * Invalidate the current session (revokes refresh token).
 * Clears tokens from local storage.
 * @returns {Promise<{message: string}>}
 */
async function logout() {
  const storedRefreshToken = getRefreshToken();

  const data = await authFetch("/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: storedRefreshToken }),
  });

  clearTokens();
  return data;
}

// ------------------------------------------------------------
// 6. DELETE ACCOUNT
// DELETE /me
// ------------------------------------------------------------

/**
 * Permanently delete the authenticated user's account.
 * Requires password confirmation.
 * @param {string} password - Current account password
 * @returns {Promise<{message: string}>}
 */
async function deleteAccount(password) {
  const data = await authFetch("/me", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });

  clearTokens();
  return data;
}

// ------------------------------------------------------------
// AUTO-REFRESH INTERCEPTOR
// Retries a failed request once after refreshing the token.
// ------------------------------------------------------------

/**
 * Wraps an API call and automatically refreshes the access token
 * on a 401 response, then retries the original request once.
 * @param {Function} apiFn - Async function to call
 * @returns {Promise<any>}
 */
async function withAutoRefresh(apiFn) {
  try {
    return await apiFn();
  } catch (error) {
    if (error.status === 401) {
      try {
        await refreshToken();
        return await apiFn(); // Retry once with new token
      } catch (refreshError) {
        clearTokens();
        throw new Error("Session expired. Please log in again.");
      }
    }
    throw error;
  }
}

// ------------------------------------------------------------
// USAGE EXAMPLES
// ------------------------------------------------------------

// --- Register ---
// register("anu@example.com", "Secure#Pass9", "anu_dev", "Anu Sharma")
//   .then(data => console.log("Registered:", data.user))
//   .catch(err => console.error("Register error:", err.message));

// --- Login ---
// login("anu@example.com", "Secure#Pass9")
//   .then(data => console.log("Logged in:", data.user))
//   .catch(err => console.error("Login error:", err.message));

// --- Get Profile (with auto-refresh on expiry) ---
// withAutoRefresh(getProfile)
//   .then(profile => console.log("Profile:", profile))
//   .catch(err => console.error("Profile error:", err.message));

// --- Refresh Token ---
// refreshToken()
//   .then(data => console.log("Token refreshed, expires in:", data.expires_in))
//   .catch(err => console.error("Refresh error:", err.message));

// --- Logout ---
// logout()
//   .then(() => console.log("Logged out successfully"))
//   .catch(err => console.error("Logout error:", err.message));

// --- Delete Account ---
// deleteAccount("Secure#Pass9")
//   .then(() => console.log("Account deleted"))
//   .catch(err => console.error("Delete error:", err.message));

// ------------------------------------------------------------
// EXPORTS (for use as a module in Node.js or bundlers)
// ------------------------------------------------------------

// Uncomment if using ES Modules:
// export { register, login, getProfile, refreshToken, logout, deleteAccount, withAutoRefresh };

// Uncomment if using CommonJS (Node.js):
// module.exports = { register, login, getProfile, refreshToken, logout, deleteAccount, withAutoRefresh };