import { useState } from "react";
import { lessons, CHEATSHEET } from "./lessons.js";
import CodeBlock from "./CodeBlock.jsx";
import ChatSimulator from "./ChatSimulator.jsx";
import "./styles.css";

export default function Day52() {
  const [activeLesson, setActiveLesson] = useState(0);
  const [completed, setCompleted] = useState([]);
  const lesson = lessons[activeLesson];

  const markDone = () => {
    if (!completed.includes(activeLesson)) {
      setCompleted((prev) => [...prev, activeLesson]);
    }
    if (activeLesson < lessons.length - 1) setActiveLesson((p) => p + 1);
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div>
          <div className="day-badge">DAY 52</div>
        </div>
        <div>
          <div className="header-title">Socket.io Client</div>
          <div className="header-sub">Real-time with Socket.io · Topic 2 of 4</div>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-text">{completed.length}/{lessons.length} done</div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${(completed.length / lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {lessons.map((l, i) => (
          <button
            key={l.id}
            className={`tab ${activeLesson === i ? "active" : ""}`}
            onClick={() => setActiveLesson(i)}
          >
            {completed.includes(i)
              ? <span className="tab-check">✓</span>
              : <span className="tab-num">{i + 1}</span>
            }
            {l.icon} {l.title.split("(")[0].trim()}
          </button>
        ))}
        <button
          className={`tab ${activeLesson === 4 ? "active" : ""}`}
          onClick={() => setActiveLesson(4)}
        >
          🧪 Live Demo
        </button>
      </div>

      {/* Lesson or Demo */}
      {activeLesson < 4 ? (
        <div className="lesson-card">
          <div className="lesson-icon">{lesson.icon}</div>
          <div className="lesson-title">{lesson.title}</div>

          <div className="section-label">Concept</div>
          <div className="theory-text">{lesson.theory}</div>

          <div className="section-label">Code</div>
          <CodeBlock code={lesson.code} highlight={lesson.highlight} />

          <div className="note-box">
            <span className="note-icon">💡</span>
            <span>{lesson.note}</span>
          </div>

          <div className="lesson-footer">
            <button
              className="btn-prev"
              disabled={activeLesson === 0}
              onClick={() => setActiveLesson((p) => p - 1)}
            >
              ← Prev
            </button>
            <button className="btn-next" onClick={markDone}>
              {activeLesson < lessons.length - 1 ? "Mark Done & Next →" : "Finish & See Demo →"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <ChatSimulator />
          <div className="summary">
            <div className="summary-title">📋 Quick Reference — Socket.io Client</div>
            <div className="cheatsheet">
              {CHEATSHEET.map((item, i) => (
                <div key={i} className="cs-item">
                  <div className="cs-code">{item.code}</div>
                  <div className="cs-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}