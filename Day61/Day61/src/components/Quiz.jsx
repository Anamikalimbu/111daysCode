import React, { useState } from 'react';
import { QUESTIONS } from './questions';

export default function Quiz() {
  const [answers, setAnswers] = useState({}); // { [qId]: optionIndex }
  const [submitted, setSubmitted] = useState({}); // { [qId]: true }

  const select = (qId, optionIndex) => {
    if (submitted[qId]) return;
    setAnswers((a) => ({ ...a, [qId]: optionIndex }));
  };

  const submit = (qId) => {
    if (answers[qId] === undefined) return;
    setSubmitted((s) => ({ ...s, [qId]: true }));
  };

  const score = QUESTIONS.filter(
    (q) => submitted[q.id] && answers[q.id] === q.correct
  ).length;
  const answeredCount = Object.keys(submitted).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 anim-stagger">
      <div className="flex items-center justify-between border border-[#1c2733] rounded-lg bg-[#0f141a] px-5 py-3 transition-colors">
        <span className="text-sm text-[#8b9aab]">
          {answeredCount} / {QUESTIONS.length} answered
        </span>
        <span className="text-sm font-mono text-[#5fd0a8] transition-all duration-300">
          Score: {score} / {QUESTIONS.length}
        </span>
      </div>

      {QUESTIONS.map((q) => {
        const isSubmitted = submitted[q.id];
        const selected = answers[q.id];

        return (
          <div
            key={q.id}
            className="border border-[#1c2733] rounded-lg bg-[#0f141a] p-5 transition-all duration-300 hover:border-[#2a3848]"
          >
            <p className="font-medium text-[#e6edf3] mb-3">
              {q.id}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                let style =
                  'border-[#1c2733] hover:border-[#2a3848] text-[#c9d1d9]';

                if (isSubmitted) {
                  if (idx === q.correct) {
                    style = 'border-[#1f3a2c] bg-[#102019] text-[#5fd0a8]';
                  } else if (idx === selected) {
                    style = 'border-[#3a1f1f] bg-[#201010] text-[#e08a8a]';
                  } else {
                    style = 'border-[#1c2733] text-[#5d6b7a]';
                  }
                } else if (idx === selected) {
                  style = 'border-[#5fd0a8] bg-[#11201a] text-[#e6edf3]';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => select(q.id, idx)}
                    className={`btn-press w-full text-left text-sm px-4 py-2.5 rounded-md border transition-all duration-200 ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!isSubmitted ? (
              <button
                onClick={() => submit(q.id)}
                disabled={selected === undefined}
                className="btn-press mt-3 text-sm font-medium px-3 py-1.5 rounded-md border border-[#2a3848] text-[#c9d1d9] hover:border-[#5fd0a8] hover:text-[#5fd0a8] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check answer
              </button>
            ) : (
              <div className="anim-content mt-3 text-sm text-[#8b9aab] leading-relaxed border-t border-[#1c2733] pt-3">
                <span className="text-[#e0a458] font-medium">Why: </span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}