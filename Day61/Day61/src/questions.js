export const QUESTIONS = [
  {
    id: 1,
    question: 'Why use a short-lived access token alongside a long-lived refresh token?',
    options: [
      'Access tokens are easier to encode',
      'If an access token is stolen, the damage window is small (15 min) before it expires',
      'Refresh tokens are sent on every request, so they must be short',
      'Short tokens use less database storage',
    ],
    correct: 1,
    explanation:
      'The access token is the one sent on every API request, so it\'s the one most likely to leak. Keeping it short-lived limits how long a stolen token is useful. The refresh token stays put in an httpOnly cookie and is rarely transmitted.',
  },
  {
    id: 2,
    question: 'Where should the refresh token be stored on the client?',
    options: [
      'localStorage, for easy access via JavaScript',
      'In Redux/Context state',
      'An httpOnly, secure cookie',
      'A query string parameter on every request',
    ],
    correct: 2,
    explanation:
      'httpOnly cookies cannot be read by JavaScript, which protects the refresh token from XSS attacks. localStorage and JS-accessible state are both readable by any injected script.',
  },
  {
    id: 3,
    question: 'On /refresh-token, why check the token against a value stored in the database, not just verify its JWT signature?',
    options: [
      'JWT signature verification is too slow',
      'It lets you immediately revoke a token (e.g. on logout or password change) even if it hasn\'t expired yet',
      'Databases are required for JWT to work at all',
      'It prevents the token from expiring',
    ],
    correct: 1,
    explanation:
      'A valid JWT signature only proves the token wasn\'t tampered with — it doesn\'t know if you\'ve since logged out. Storing the current refresh token in the DB and comparing gives you a way to invalidate it on demand.',
  },
  {
    id: 4,
    question: 'What should /logout do to fully secure the session?',
    options: [
      'Just delete the access token on the client',
      'Clear the refresh token cookie only',
      'Remove the refresh token from the database AND clear the cookie',
      'Nothing — tokens expire automatically so logout is just a UI redirect',
    ],
    correct: 2,
    explanation:
      'Clearing only the cookie leaves a still-valid refresh token in the DB — if someone had copied that cookie before logout, it would still work. You need to invalidate it server-side too.',
  },
  {
    id: 5,
    question: 'What is "refresh token rotation"?',
    options: [
      'Changing the JWT secret key every day',
      'Issuing a brand new refresh token each time the old one is used, and invalidating the old one',
      'Rotating which server handles refresh requests',
      'Encrypting the refresh token with a different algorithm each request',
    ],
    correct: 1,
    explanation:
      'Rotation means each /refresh-token call returns a new refresh token AND invalidates the old one in the DB. If a stolen refresh token is ever reused after the legitimate user already rotated it, it\'s detected as invalid — a strong signal of theft.',
  },
  {
    id: 6,
    question: 'In the axios interceptor pattern, what does `original._retry = true` prevent?',
    options: [
      'It prevents the user from retrying manually',
      'An infinite loop: if the retried request also returns 401, the interceptor won\'t try to refresh again forever',
      'It prevents the token from being sent twice',
      'It disables caching for that request',
    ],
    correct: 1,
    explanation:
      'Without this flag, a persistently-401 request would trigger refresh → retry → 401 → refresh → retry... forever. The flag marks "already retried once" so the interceptor gives up and redirects to login instead.',
  },
];