import React, { useState } from 'react';
import Playground from './components/Playground';
import Quiz from './components/Quiz';
import TokenSimulator from './components/TokenSimulator';
import { IconRotate, IconCode, IconQuiz, IconCheck } from './components/icons';
import './animations.css';

const TABS = [
  {
    id: 'simulator',
    label: 'Token Simulator',
    desc: 'Watch tokens expire & rotate in real time',
    Icon: IconRotate,
  },
  {
    id: 'playground',
    label: 'Code Playground',
    desc: 'Login, refresh, logout & interceptor code',
    Icon: IconCode,
  },
  {
    id: 'quiz',
    label: 'Quiz',
    desc: '6 questions on tokens & security',
    Icon: IconQuiz,
  },
];

export default function App() {
  const [tab, setTab] = useState('simulator');
  const [visited, setVisited] = useState(new Set(['simulator']));
  const [contentKey, setContentKey] = useState(0);

  const go = (id) => {
    if (id === tab) return;
    setTab(id);
    setVisited((v) => new Set(v).add(id));
    setContentKey((k) => k + 1);
  };

  const idx = TABS.findIndex((t) => t.id === tab);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#e6edf3] font-[Inter,sans-serif] flex flex-col anim-fade-in">
      <header className="header-gradient border-b border-[#1c2733] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest text-[#5fd0a8] bg-[#102019] border border-[#1f3a2c] px-2 py-1 rounded nav-active-glow">
            DAY 61
          </span>
          <h1 className="text-xl font-semibold tracking-tight">
            Refresh Tokens &amp; Logout System
          </h1>
        </div>
        <p className="mt-1 text-sm text-[#8b9aab]">
          Rotating access tokens, persisting refresh tokens, and revoking sessions on logout.
        </p>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar nav */}
        <nav className="md:w-64 border-b md:border-b-0 md:border-r border-[#1c2733] p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {TABS.map((t, i) => {
            const active = tab === t.id;
            const done = visited.has(t.id);
            return (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`nav-item icon-spin-hover btn-press flex items-center gap-3 text-left px-3 py-3 rounded-lg border min-w-[220px] md:min-w-0 anim-content ${
                  active
                    ? 'bg-[#11161d] border-[#5fd0a8]/40 text-[#e6edf3]'
                    : 'border-transparent text-[#8b9aab] hover:bg-[#0f141a] hover:text-[#e6edf3]'
                }`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-md border shrink-0 transition-colors ${
                    active
                      ? 'border-[#1f3a2c] bg-[#102019] text-[#5fd0a8]'
                      : 'border-[#1c2733] text-[#5d6b7a]'
                  }`}
                >
                  <t.Icon className="w-4.5 h-4.5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span className="block text-xs text-[#5d6b7a] mt-0.5">{t.desc}</span>
                </span>
                {done && (
                  <span className="text-[#5fd0a8] shrink-0 anim-fade-in">
                    <IconCheck className="w-4 h-4" />
                  </span>
                )}
              </button>
            );
          })}

          <div className="hidden md:block mt-auto pt-4 border-t border-[#1c2733] text-xs text-[#5d6b7a]">
            <div className="flex items-center justify-between mb-1.5">
              <span>Progress</span>
              <span className="font-mono">{visited.size} / {TABS.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#1c2733] overflow-hidden">
              <div
                className="h-full bg-[#5fd0a8] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(visited.size / TABS.length) * 100}%` }}
              />
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div key={contentKey} className="anim-content">
            {tab === 'simulator' && (
              <div className="max-w-3xl mx-auto">
                <TokenSimulator />
              </div>
            )}
            {tab === 'playground' && <Playground />}
            {tab === 'quiz' && <Quiz />}
          </div>

          {/* Next-step nav */}
          <div className="max-w-3xl mx-auto mt-8 flex justify-between">
            {idx > 0 ? (
              <button
                onClick={() => go(TABS[idx - 1].id)}
                className="btn-press text-sm font-medium px-3 py-1.5 rounded-md border border-[#1c2733] text-[#8b9aab] hover:text-[#e6edf3] hover:border-[#2a3848]"
              >
                &larr; {TABS[idx - 1].label}
              </button>
            ) : <span />}

            {idx < TABS.length - 1 ? (
              <button
                onClick={() => go(TABS[idx + 1].id)}
                className="btn-press text-sm font-medium px-3 py-1.5 rounded-md border border-[#1f3a2c] bg-[#102019] text-[#5fd0a8] hover:bg-[#16271e]"
              >
                {TABS[idx + 1].label} &rarr;
              </button>
            ) : <span />}
          </div>
        </main>
      </div>
    </div>
  );
}