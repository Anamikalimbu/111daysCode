import React, { useState, useMemo } from 'react';
import Checkpoint from './Checkpoint';
import TokenInspector from './TokenInspector';
import CodePanel from './CodePanel';
import { decodeToken, isExpired } from '../utils/tokenUtils';

// Pre-baked demo tokens (fake signatures — for teaching only)
const sampleHeader = '{"alg":"HS256","typ":"JWT"}';
const b64 = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '');

const futureExp = Math.floor(Date.now() / 1000) + 3600;
const pastExp = Math.floor(Date.now() / 1000) - 3600;
const TOKENS = {
  none: null,
  user: `${b64(JSON.parse(sampleHeader))}.${b64({ id: 'u_104', role: 'user', iat: 1, exp: futureExp })}.fakeSig123`,
  admin: `${b64(JSON.parse(sampleHeader))}.${b64({ id: 'u_007', role: 'admin', iat: 1, exp: futureExp })}.fakeSig456`,
  expired: `${b64(JSON.parse(sampleHeader))}.${b64({ id: 'u_104', role: 'user', iat: 1, exp: pastExp })}.fakeSigExp`,
  malformed: 'not.a.valid.jwt.token.at.all',
};

const SCENARIOS = [
  { id: 'none', label: 'No token sent', tooltip: 'Request has no Authorization header' },
  { id: 'malformed', label: 'Malformed token', tooltip: 'Header present but token is garbage' },
  { id: 'expired', label: 'Expired token', tooltip: 'Valid format, but exp has passed' },
  { id: 'user', label: 'Valid user token', tooltip: 'role: "user" — try the /admin route!' },
  { id: 'admin', label: 'Valid admin token', tooltip: 'role: "admin" — full access' },
];
export default function AuthSimulator() {
  const [scenarioId, setScenarioId] = useState('none');
  const [route, setRoute] = useState('profile'); // 'profile' | 'admin'

  const token = TOKENS[scenarioId];

  const result = useMemo(() => {
    // Stage 1: header check
    if (!token) {
      return { stage: 'header', status: 'fail', code: 'noToken', message: '401 — No token provided. Access denied.' };
    }
    if (scenarioId === 'malformed') {
      return { stage: 'verify', status: 'fail', code: 'invalidToken', message: '401 — Invalid token.' };
    }
    const decoded = decodeToken(token);
    if (isExpired(decoded)) {
      return { stage: 'verify', status: 'fail', code: 'expiredToken', message: '401 — Token expired. Please log in again.' };
    }
    // Stage 3: role check (only matters for /admin route)
    if (route === 'admin' && decoded.role !== 'admin') {
      return { stage: 'role', status: 'fail', code: 'wrongRole', message: '403 — Forbidden: insufficient permissions.' };
    }
    return { stage: 'granted', status: 'pass', code: 'success', message: `200 — Welcome! user: ${JSON.stringify(decoded)}` };
  }, [token, scenarioId, route]);

  return (
    <div className="simulator">
      <header className="simulator-header">
        <span className="eyebrow">Day 60 · Lesson</span>
        <h1>Protected Routes &amp; Auth Middleware</h1>
        <p className="lede">
          Every protected request passes through a gate. The middleware checks the
          <strong> Authorization header</strong>, verifies the <strong>JWT signature &amp; expiry</strong>,
          then optionally checks the user's <strong>role</strong> before the route handler ever runs.
        </p>
      </header>

      <section className="controls">
        <div className="control-group">
          <span className="control-title">1 · Choose request token</span>
          <div className="chip-row">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                className={`chip ${scenarioId === s.id ? 'chip-active' : ''}`}
                onClick={() => setScenarioId(s.id)}
                title={s.tooltip}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <span className="control-title">2 · Choose target route</span>
          <div className="chip-row">
            <button className={`chip ${route === 'profile' ? 'chip-active' : ''}`} onClick={() => setRoute('profile')}>
              GET /api/profile <span className="chip-sub">(protect)</span>
            </button>
            <button className={`chip ${route === 'admin' ? 'chip-active' : ''}`} onClick={() => setRoute('admin')}>
              GET /api/admin <span className="chip-sub">(protect + authorize('admin'))</span>
            </button>
          </div>
        </div>
      </section>

      <section className="visual-grid">
        <div className="panel">
          <h3>Request Pipeline</h3>
          <Checkpoint stage={result.stage} status={result.status} />
          <div className={`response-banner ${result.status === 'pass' ? 'response-ok' : 'response-fail'}`}>
            {result.message}
          </div>
        </div>

        <div className="panel">
          <h3>Token Inspector</h3>
          <TokenInspector token={token} />
        </div>
      </section>

      <section className="panel">
        <h3>Relevant Middleware Code</h3>
        <CodePanel scenario={result.code} />
      </section>
    </div>
  );
}