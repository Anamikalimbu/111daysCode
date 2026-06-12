import React from 'react';

// The "Gate" — visualizes the request passing through middleware checkpoints
export default function Checkpoint({ stage, status }) {
  // stage: 'header' | 'verify' | 'role' | 'granted'
  // status: 'idle' | 'pass' | 'fail'

  const stages = [
    { key: 'header', label: 'Authorization Header', desc: 'Bearer <token> present?' },
    { key: 'verify', label: 'jwt.verify()', desc: 'Signature & expiry valid?' },
    { key: 'role', label: 'Role Check', desc: 'authorize(...roles)' },
    { key: 'granted', label: 'Route Handler', desc: 'Access granted' },
  ];

  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="checkpoint-track">
      {stages.map((s, i) => {
        let state = 'pending';
        if (i < currentIndex) state = 'cleared';
        if (i === currentIndex) state = status === 'fail' ? 'fail' : 'active';

        return (
          <React.Fragment key={s.key}>
            <div className={`gate gate-${state}`}>
              <div className="gate-icon">
                {state === 'cleared' && '✓'}
                {state === 'fail' && '✕'}
                {state === 'active' && '●'}
                {state === 'pending' && '○'}
              </div>
              <div className="gate-label">{s.label}</div>
              <div className="gate-desc">{s.desc}</div>
            </div>
            {i < stages.length - 1 && <div className={`gate-connector ${i < currentIndex ? 'connector-active' : ''}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}