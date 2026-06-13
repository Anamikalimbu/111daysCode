// Reference snippets shown in the Playground.
// Each snippet is intentionally incomplete or buggy in spots —
// the "Reveal fix" button shows the corrected version.

export const SNIPPETS = [
  {
    id: 'issue-tokens',
    title: '1. Issue access + refresh tokens on login',
    description:
      'After verifying credentials, issue a short-lived access token (returned in JSON) and a long-lived refresh token (set as an httpOnly cookie).',
    broken: `// controllers/authController.js
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // TODO: create a refresh token and send it safely to the client
  // TODO: store the refresh token somewhere so we can revoke it later

  res.json({ accessToken });
};`,
    fixed: `// controllers/authController.js
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Persist so it can be revoked / rotated later
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,        // HTTPS only in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ accessToken });
};`,
  },
  {
    id: 'refresh-endpoint',
    title: '2. /refresh-token endpoint',
    description:
      'Reads the refresh token from the httpOnly cookie, verifies it against both the JWT secret AND the stored value in the DB, then issues a new access token.',
    broken: `// routes/authRoutes.js
router.post('/refresh-token', async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  // TODO: verify token signature
  // TODO: check token matches the one stored on the user
  // TODO: issue a new access token
});`,
    fixed: `// routes/authRoutes.js
router.post('/refresh-token', async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Token expired or invalid' });
  }
});`,
  },
  {
    id: 'logout',
    title: '3. /logout endpoint',
    description:
      'Clears the refresh token cookie AND removes it from the database, so the old token can never be used again — even if someone has a copy of it.',
    broken: `// routes/authRoutes.js
router.post('/logout', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  // TODO: invalidate the refresh token in the DB
  // TODO: clear the cookie on the client
});`,
    fixed: `// routes/authRoutes.js
router.post('/logout', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  const user = await User.findOne({ refreshToken: token });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.sendStatus(204);
});`,
  },
  {
    id: 'axios-interceptor',
    title: '4. Frontend: auto-refresh with axios interceptor',
    description:
      'When a request fails with 401, silently call /refresh-token, get a new access token, and retry the original request — so the user is never logged out unnecessarily.',
    broken: `// api/axiosClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends the httpOnly refresh cookie
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // TODO: if error is 401, request a new access token
    // TODO: retry the original request with the new token
    return Promise.reject(error);
  }
);

export default api;`,
    fixed: `// api/axiosClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends the httpOnly refresh cookie
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // prevent infinite retry loops

      try {
        const { data } = await api.post('/refresh-token');
        setAccessToken(data.accessToken); // e.g. store in memory/context
        original.headers.Authorization = \`Bearer \${data.accessToken}\`;
        return api(original); // retry original request
      } catch (refreshErr) {
        // refresh token also invalid -> force logout
        redirectToLogin();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;`,
  },
];