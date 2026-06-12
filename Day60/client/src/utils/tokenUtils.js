// Minimal client-side JWT decoder (for display purposes only —
// never trust client-side decoding for security decisions).
export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

export function isExpired(decoded) {
  if (!decoded?.exp) return false;
  return Date.now() >= decoded.exp * 1000;
}