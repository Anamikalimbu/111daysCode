import React, { useState, useEffect, useRef } from 'react';

// Simulated timescale: 1 real second = this many simulated seconds
const TIME_SCALE = 6;
const ACCESS_LIFETIME = 90;   // simulated seconds (~15 min scaled down)
const REFRESH_LIFETIME = 600; // simulated seconds (~7 days scaled down)

function genToken(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function StatusBar({ label, age, lifetime, color }) {
  const pct = Math.min(100, (age / lifetime) * 100);
  const remaining = Math.max(0, lifetime - age);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#8b9aab] font-mono">{label}</span>
        <span className="text-[#8b9aab] font-mono">{Math.ceil(remaining)}s left</span>
      </div>
      <div className="h-2 rounded-full bg-[#1c2733] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${pct}%`,
            backgroundColor: pct > 85 ? '#e08a8a' : color,
          }}
        />
      </div>
    </div>
  );
}

export default function TokenSimulator() {
  const [accessToken, setAccessToken] = useState(genToken('acc'));
  const [refreshToken, setRefreshToken] = useState(genToken('ref'));
  const [accessAge, setAccessAge] = useState(0);
  const [refreshAge, setRefreshAge] = useState(0);
  const [running, setRunning] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const [rotation, setRotation] = useState(true);
  const [log, setLog] = useState([
    { t: 0, msg: 'Logged in — access & refresh tokens issued', kind: 'info' },
  ]);
  const tickRef = useRef(null);

  const addLog = (msg, kind = 'info') => {
    setLog((l) => [{ t: Date.now(), msg, kind }, ...l].slice(0, 12));
  };

  // Main clock
  useEffect(() => {
    if (!running || loggedOut) return;
    tickRef.current = setInterval(() => {
      setAccessAge((a) => a + 0.2 * TIME_SCALE);
      setRefreshAge((r) => r + 0.2 * TIME_SCALE);
    }, 200);
    return () => clearInterval(tickRef.current);
  }, [running, loggedOut]);

  // Access token expiry -> auto attempt refresh
  useEffect(() => {
    if (loggedOut) return;
    if (accessAge >= ACCESS_LIFETIME) {
      if (refreshAge >= REFRESH_LIFETIME) {
        addLog('Access token expired. Refresh token ALSO expired -> forced logout', 'error');
        setLoggedOut(true);
        return;
      }
      addLog('Access token expired (401) -> interceptor calls /refresh-token', 'warn');
      const newAccess = genToken('acc');
      setAccessToken(newAccess);
      setAccessAge(0);

      if (rotation) {
        const newRefresh = genToken('ref');
        setRefreshToken(newRefresh);
        setRefreshAge(0);
        addLog('Server rotated refresh token (old one invalidated in DB)', 'success');
      } else {
        addLog('New access token issued, refresh token unchanged', 'success');
      }
    }
  }, [accessAge, loggedOut, refreshAge, rotation]);

  const handleLogout = () => {
    addLog('Logout: refresh token cleared from DB + cookie removed', 'error');
    setLoggedOut(true);
    setRunning(false);
  };

  const handleReset = () => {
    setAccessToken(genToken('acc'));
    setRefreshToken(genToken('ref'));
    setAccessAge(0);
    setRefreshAge(0);
    setLoggedOut(false);
    setRunning(true);
    setLog([{ t: Date.now(), msg: 'Logged in — access & refresh tokens issued', kind: 'info' }]);
  };

  const handleSteal = () => {
    // simulate a stolen refresh token being replayed after rotation
    addLog('Attacker replays an OLD refresh token (already rotated)', 'warn');
    addLog('Server: stored token mismatch -> 403, all sessions revoked', 'error');
    setLoggedOut(true);
    setRunning(false);
  };

  const logColor = {
    info: 'text-[#8b9aab]',
    warn: 'text-[#e0a458]',
    success: 'text-[#5fd0a8]',
    error: 'text-[#e08a8a]',
  };

  return (
    <div className="border border-[#1c2733] rounded-lg bg-[#0f141a] p-5 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-[#e6edf3]">Live Token Lifecycle Simulator</h3>
          <p className="mt-1 text-sm text-[#8b9aab] max-w-md">
            Watch the access token expire every {ACCESS_LIFETIME}s (sim) and trigger an
            automatic refresh. The refresh token expires every {REFRESH_LIFETIME}s (sim).
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-[#8b9aab] font-mono">
          <input
            type="checkbox"
            checked={rotation}
            onChange={() => setRotation((r) => !r)}
            className="accent-[#5fd0a8]"
          />
          rotation enabled
        </label>
      </div>

      {loggedOut ? (
        <div className="border border-[#3a1f1f] bg-[#201010] text-[#e08a8a] rounded-md p-4 text-sm">
          Session ended. {refreshAge >= REFRESH_LIFETIME ? 'Refresh token expired.' : 'Tokens invalidated.'}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-mono text-[#5d6b7a] mb-1">ACCESS TOKEN (memory, sent every request)</div>
            <div className="text-sm font-mono text-[#e6edf3] mb-2">{accessToken}</div>
            <StatusBar label="access lifetime" age={accessAge} lifetime={ACCESS_LIFETIME} color="#5fd0a8" />
          </div>
          <div>
            <div className="text-xs font-mono text-[#5d6b7a] mb-1">REFRESH TOKEN (httpOnly cookie)</div>
            <div className="text-sm font-mono text-[#e6edf3] mb-2">{refreshToken}</div>
            <StatusBar label="refresh lifetime" age={refreshAge} lifetime={REFRESH_LIFETIME} color="#4a90d9" />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!loggedOut && (
          <>
            <button
              onClick={() => setRunning((r) => !r)}
              className="text-sm font-medium px-3 py-1.5 rounded-md border border-[#2a3848] text-[#c9d1d9] hover:border-[#5fd0a8] hover:text-[#5fd0a8] transition-colors"
            >
              {running ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => setAccessAge(ACCESS_LIFETIME)}
              className="text-sm font-medium px-3 py-1.5 rounded-md border border-[#3a3320] text-[#e0a458] hover:bg-[#201a10] transition-colors"
            >
              Force access token to expire
            </button>
            <button
              onClick={handleSteal}
              className="text-sm font-medium px-3 py-1.5 rounded-md border border-[#3a1f1f] text-[#e08a8a] hover:bg-[#201010] transition-colors"
            >
              Simulate stolen refresh token replay
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1.5 rounded-md border border-[#1c2733] text-[#8b9aab] hover:text-[#e6edf3] transition-colors"
            >
              Logout
            </button>
          </>
        )}
        {loggedOut && (
          <button
            onClick={handleReset}
            className="text-sm font-medium px-3 py-1.5 rounded-md border border-[#1f3a2c] bg-[#102019] text-[#5fd0a8] hover:bg-[#16271e] transition-colors"
          >
            Login again (reset)
          </button>
        )}
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#5d6b7a] mb-2">Event log</div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {log.map((entry, i) => (
            <div key={entry.t + i} className={`text-xs font-mono ${logColor[entry.kind]}`}>
              {entry.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}