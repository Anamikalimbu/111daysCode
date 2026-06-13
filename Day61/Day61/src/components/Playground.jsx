import React, { useState } from 'react';
import { SNIPPETS } from './snippets';

function CodeBlock({ code }) {
  return (
    <pre className="bg-[#0d1117] border border-[#1c2733] rounded-md p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#c9d1d9]">
      <code>{code}</code>
    </pre>
  );
}

function SnippetCard({ snippet }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="border border-[#1c2733] rounded-lg bg-[#0f141a] overflow-hidden transition-all duration-300 hover:border-[#2a3848] hover:shadow-[0_4px_24px_-8px_rgba(95,208,168,0.15)]">
      <div className="px-5 py-4 border-b border-[#1c2733]">
        <h3 className="font-semibold text-[#e6edf3]">{snippet.title}</h3>
        <p className="mt-1 text-sm text-[#8b9aab]">{snippet.description}</p>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#e0a458]">
              {revealed ? 'Solution' : 'Starter — fill in the TODOs'}
            </span>
          </div>
          <CodeBlock code={revealed ? snippet.fixed : snippet.broken} />
        </div>

        <button
          onClick={() => setRevealed((r) => !r)}
          className="btn-press text-sm font-medium px-3 py-1.5 rounded-md border border-[#1f3a2c] bg-[#102019] text-[#5fd0a8] hover:bg-[#16271e]"
        >
          {revealed ? 'Hide solution' : 'Reveal solution'}
        </button>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 anim-stagger">
      <div className="text-sm text-[#8b9aab] leading-relaxed">
        Each block below has TODOs marking the refresh-token / logout logic.
        Read the broken version, think through what's missing, then reveal
        the solution to compare.
      </div>

      {SNIPPETS.map((s) => (
        <SnippetCard key={s.id} snippet={s} />
      ))}
    </div>
  );
}