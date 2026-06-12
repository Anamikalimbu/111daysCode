import React from 'react';
import { decodeToken, isExpired } from '../utils/tokenUtils';

export default function TokenInspector({ token }) {
  if (!token) {
    return <div className="inspector empty">No token attached to request.</div>;
  }

  const decoded = decodeToken(token);
  const expired = isExpired(decoded);

  return (
    <div className="inspector">
      <div className="inspector-row">
        <span className="inspector-label">Raw Token</span>
        <code className="inspector-token">{token}</code>
      </div>
      {decoded ? (
        <>
          <div className="inspector-row">
            <span className="inspector-label">Payload</span>
            <pre className="inspector-payload">{JSON.stringify(decoded, null, 2)}</pre>
          </div>
          <div className="inspector-row">
            <span className="inspector-label">Status</span>
            <span className={`badge ${expired ? 'badge-expired' : 'badge-valid'}`}>
              {expired ? 'EXPIRED' : 'VALID SIGNATURE FORMAT'}
            </span>
          </div>
        </>
      ) : (
        <div className="inspector-row">
          <span className="badge badge-expired">MALFORMED TOKEN</span>
        </div>
      )}
    </div>
  );
}