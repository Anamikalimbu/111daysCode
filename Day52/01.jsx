import { useState, useEffect, useRef } from "react";

const lessons = [
  {
    id: 1,
    title: "What is Socket.io Client?",
    icon: "🔌",
    theory: `Socket.io Client is the browser-side library that connects to a Socket.io Server over WebSockets (with HTTP long-polling as fallback).

Unlike regular HTTP (request → response), Socket.io keeps a persistent connection open so both the client AND server can send messages at any time — this is called full-duplex communication.`,
    code: `// Install
npm install socket.io-client

// In your React/JS file
import { io } from "socket.io-client";

// Connect to the server
const socket = io("http://localhost:5000");

// Connection events
socket.on("connect", () => {
  console.log("Connected! ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});`,
    highlight: ["socket.on", "socket.id", "io("],
    note: "socket.id is a unique ID assigned by the server to this client connection.",
  },
  {
    id: 2,
    title: "Emitting Events (Client → Server)",
    icon: "📤",
    theory: `socket.emit() lets the client SEND data to the server.

Think of it like calling a specific function on the server — you give it an event name and any data payload. The server listens for that event name with socket.on().`,
    code: `// Basic emit
socket.emit("message", "Hello Server!");

// Emit with an object
socket.emit("chat", {
  username: "Anu",
  text: "Hey everyone!",
  timestamp: Date.now()
});

// Emit with acknowledgement (callback)
socket.emit("joinRoom", { room: "general" }, (response) => {
  console.log("Server replied:", response);
  // response = { success: true, members: 5 }
});`,
    highlight: ["socket.emit", "emit("],
    note: "The first argument is always the event name (a string). The server must have socket.on('message', ...) to receive it.",
  },
  {
    id: 3,
    title: "Listening to Events (Server → Client)",
    icon: "📥",
    theory: `socket.on() lets the client RECEIVE data from the server.

The server can emit events at any time — not just in response to a client message. This is what makes real-time apps possible: the server can push updates to all clients instantly.`,
    code: `// Listen for a simple event
socket.on("welcome", (message) => {
  console.log(message); // "Welcome to the chat!"
});

// Listen for object data
socket.on("newMessage", (data) => {
  console.log(data.username, ":", data.text);
});

// Listen for server broadcast to all clients
socket.on("userJoined", (data) => {
  showNotification(\`\${data.username} joined the room\`);
});

// Remove a listener (cleanup in React useEffect)
return () => {
  socket.off("newMessage");
  socket.disconnect();
};`,
    highlight: ["socket.on", "socket.off", "socket.disconnect"],
    note: "Always clean up listeners in React's useEffect return to prevent memory leaks and duplicate handlers.",
  },
  {
    id: 4,
    title: "Socket.io in React (useEffect Pattern)",
    icon: "⚛️",
    theory: `In React, you should initialize the socket inside useEffect and clean it up on component unmount.

This prevents duplicate connections when React re-renders and ensures the socket is properly disconnected when the user leaves the page.`,
    code: `import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Chat() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create connection
    socketRef.current = io("http://localhost:5000");

    // Listen for incoming messages
    socketRef.current.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []); // Empty array = run once on mount

  const sendMessage = (text) => {
    socketRef.current.emit("sendMessage", {
      text,
      username: "Anu"
    });
  };

  return ( /* JSX */ );
}`,
    highlight: ["useEffect", "useRef", "socketRef.current", "disconnect()"],
    note: "Use useRef to store the socket so it persists across re-renders without causing re-runs of useEffect.",
  },
];

const SIMULATED_USERS = ["Rahul", "Priya", "Bikash", "Maya", "Dev"];
const SIMULATED_MESSAGES = [
  "Hey! Anyone there? 👋",
  "Just joined the room!",
  "Socket.io is awesome 🚀",
  "Real-time is so cool",
  "Who else is learning MERN?",
  "This chat works! 🎉",
  "Emit away! 📡",
  "WebSockets > polling 💪",
];

function CodeBlock({ code, highlight = [] }) {
  const lines = code.split("\n");
  return (
    <div className="code-block">
      <div className="code-header">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="code-label">JavaScript</span>
      </div>
      <pre>
        {lines.map((line, i) => {
          let highlighted = line;
          highlight.forEach((kw) => {
            if (line.includes(kw)) {
              highlighted = null;
            }
          });
          const isHighlighted = highlight.some((kw) => line.includes(kw));
          return (
            <div key={i} className={`code-line ${isHighlighted ? "hl" : ""}`}>
              <span className="ln">{i + 1}</span>
              <span>{line}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function ChatSimulator() {
  const [messages, setMessages] = useState([
    { id: 1, user: "System", text: "Room: general — 3 users connected", system: true },
  ]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [log, setLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addLog = (entry) => {
    setLog((prev) => [entry, ...prev].slice(0, 8));
  };

  const connect = () => {
    setConnected(true);
    addLog("▶ socket = io('http://localhost:5000')");
    addLog(`✅ socket.on('connect') → id: xK9pL2`);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "System", text: "You connected! socket.id: xK9pL2", system: true },
    ]);

    // Start simulated messages
    timerRef.current = setInterval(() => {
      const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
      const text = SIMULATED_MESSAGES[Math.floor(Math.random() * SIMULATED_MESSAGES.length)];
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const msg = { id: Date.now(), user, text, incoming: true };
        setMessages((prev) => [...prev, msg]);
        addLog(`📥 socket.on('newMessage') → { user: '${user}', text: '...' }`);
      }, 1200);
    }, 4000);
  };

  const disconnect = () => {
    setConnected(false);
    clearInterval(timerRef.current);
    addLog("🔌 socket.disconnect()");
    addLog("⚡ socket.on('disconnect') fired");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "System", text: "You disconnected.", system: true },
    ]);
  };

  const send = () => {
    if (!input.trim() || !connected) return;
    addLog(`📤 socket.emit('sendMessage', { text: '${input.slice(0, 20)}...' })`);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", text: input, mine: true },
    ]);
    setInput("");
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="simulator">
      <div className="sim-header">
        <span className="sim-title">🧪 Live Simulator — Socket.io Chat</span>
        <div className="conn-controls">
          <span className={`conn-dot ${connected ? "on" : "off"}`} />
          <span className="conn-label">{connected ? "Connected" : "Disconnected"}</span>
          {!connected ? (
            <button className="btn-connect" onClick={connect}>Connect</button>
          ) : (
            <button className="btn-disconnect" onClick={disconnect}>Disconnect</button>
          )}
        </div>
      </div>

      <div className="sim-body">
        <div className="chat-panel">
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.mine ? "mine" : m.system ? "system" : "theirs"}`}>
                {!m.mine && !m.system && <span className="msg-user">{m.user}</span>}
                <span className="msg-text">{m.text}</span>
              </div>
            ))}
            {isTyping && (
              <div className="msg theirs typing">
                <span className="msg-user">{SIMULATED_USERS[0]}</span>
                <span className="msg-text">
                  <span className="dot-pulse" />
                  <span className="dot-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="dot-pulse" style={{ animationDelay: "0.4s" }} />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder={connected ? "Type a message…" : "Connect first to chat"}
              value={input}
              disabled={!connected}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn-send" disabled={!connected} onClick={send}>
              Send ↗
            </button>
          </div>
        </div>

        <div className="log-panel">
          <div className="log-title">⚡ Event Log</div>
          {log.length === 0 && <div className="log-empty">Hit "Connect" to see events…</div>}
          {log.map((entry, i) => (
            <div key={i} className={`log-entry ${i === 0 ? "fresh" : ""}`}>
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080c14;
          color: #e2e8f4;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
        }

        .app {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }

        /* Header */
        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .day-badge {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 8px;
          letter-spacing: 1px;
        }
        .header-title {
          font-size: 26px;
          font-weight: 800;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-sub {
          font-size: 13px;
          color: #64748b;
          margin-top: 2px;
        }
        .progress-bar-wrap {
          margin-left: auto;
          text-align: right;
        }
        .progress-text {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 6px;
        }
        .progress-track {
          width: 120px;
          height: 6px;
          background: #1e293b;
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border-radius: 99px;
          transition: width 0.5s ease;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          border: 1.5px solid #1e293b;
          background: #0d1424;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          color: #64748b;
          transition: all 0.2s;
          position: relative;
        }
        .tab:hover { border-color: #3b82f6; color: #93c5fd; }
        .tab.active {
          border-color: #3b82f6;
          background: #0f1f3d;
          color: #60a5fa;
          font-weight: 600;
        }
        .tab-check {
          width: 18px; height: 18px;
          background: #22c55e;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          color: white;
        }
        .tab-num {
          width: 18px; height: 18px;
          background: #1e293b;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          color: #64748b;
        }

        /* Lesson card */
        .lesson-card {
          background: #0d1424;
          border: 1.5px solid #1e293b;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          animation: fadeUp 0.35s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lesson-icon { font-size: 32px; margin-bottom: 12px; }
        .lesson-title {
          font-size: 22px;
          font-weight: 800;
          color: #e2e8f4;
          margin-bottom: 16px;
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #3b82f6;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .theory-text {
          font-size: 15px;
          line-height: 1.8;
          color: #94a3b8;
          white-space: pre-line;
          margin-bottom: 28px;
        }

        /* Code block */
        .code-block {
          background: #060b14;
          border: 1.5px solid #1e293b;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
        .code-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #0a1220;
          border-bottom: 1px solid #1e293b;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #22c55e; }
        .code-label { font-size: 11px; color: #475569; margin-left: 8px; }
        pre { overflow-x: auto; padding: 16px 0; }
        .code-line {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding: 2px 16px;
          font-size: 13px;
          color: #94a3b8;
          transition: background 0.15s;
        }
        .code-line.hl { background: rgba(59,130,246,0.08); color: #93c5fd; }
        .ln { color: #334155; width: 20px; text-align: right; flex-shrink: 0; user-select: none; font-size: 11px; }

        .note-box {
          display: flex;
          gap: 10px;
          background: rgba(59,130,246,0.07);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 13.5px;
          color: #93c5fd;
          line-height: 1.6;
        }
        .note-icon { flex-shrink: 0; font-size: 16px; }

        .lesson-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
        }
        .btn-prev {
          padding: 10px 22px;
          border-radius: 10px;
          border: 1.5px solid #1e293b;
          background: transparent;
          color: #64748b;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-prev:hover:not(:disabled) { border-color: #3b82f6; color: #93c5fd; }
        .btn-prev:disabled { opacity: 0.3; cursor: not-allowed; }
        .btn-next {
          padding: 11px 28px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-next:hover { opacity: 0.85; }

        /* Simulator */
        .simulator {
          background: #0d1424;
          border: 1.5px solid #1e293b;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 24px;
          animation: fadeUp 0.35s ease;
        }
        .sim-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #0a1220;
          border-bottom: 1.5px solid #1e293b;
        }
        .sim-title { font-size: 15px; font-weight: 700; color: #e2e8f4; }
        .conn-controls { display: flex; align-items: center; gap: 10px; }
        .conn-dot {
          width: 10px; height: 10px; border-radius: 50%;
          transition: background 0.3s;
        }
        .conn-dot.on { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
        .conn-dot.off { background: #ef4444; }
        .conn-label { font-size: 12px; color: #64748b; }
        .btn-connect {
          padding: 6px 16px;
          background: #22c55e;
          border: none; border-radius: 8px;
          color: white; font-family: 'Syne', sans-serif;
          font-size: 12px; font-weight: 700; cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-connect:hover { opacity: 0.85; }
        .btn-disconnect {
          padding: 6px 16px;
          background: #ef4444;
          border: none; border-radius: 8px;
          color: white; font-family: 'Syne', sans-serif;
          font-size: 12px; font-weight: 700; cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-disconnect:hover { opacity: 0.85; }

        .sim-body { display: flex; height: 380px; }

        .chat-panel {
          flex: 1;
          display: flex; flex-direction: column;
          border-right: 1.5px solid #1e293b;
        }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }

        .msg { display: flex; flex-direction: column; gap: 2px; max-width: 80%; }
        .msg.mine { align-self: flex-end; align-items: flex-end; }
        .msg.theirs { align-self: flex-start; }
        .msg.system { align-self: center; }
        .msg-user { font-size: 11px; color: #64748b; padding: 0 4px; }
        .msg-text {
          font-size: 13px; padding: 8px 12px;
          border-radius: 12px; line-height: 1.5;
        }
        .msg.mine .msg-text { background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; border-bottom-right-radius: 4px; }
        .msg.theirs .msg-text { background: #1e293b; color: #cbd5e1; border-bottom-left-radius: 4px; }
        .msg.system .msg-text { background: rgba(59,130,246,0.1); color: #64748b; font-size: 12px; font-style: italic; }
        .msg.typing .msg-text { display: flex; gap: 4px; align-items: center; min-width: 52px; min-height: 34px; }

        .dot-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: #64748b;
          display: inline-block;
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }

        .chat-input-row {
          display: flex; gap: 8px;
          padding: 12px 16px;
          border-top: 1.5px solid #1e293b;
        }
        .chat-input {
          flex: 1; padding: 9px 14px;
          background: #060b14;
          border: 1.5px solid #1e293b;
          border-radius: 10px;
          color: #e2e8f4;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: #3b82f6; }
        .chat-input:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-send {
          padding: 9px 18px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border: none; border-radius: 10px;
          color: white; font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-send:disabled { opacity: 0.3; cursor: not-allowed; }
        .btn-send:hover:not(:disabled) { opacity: 0.85; }

        .log-panel {
          width: 280px; padding: 16px;
          overflow-y: auto; display: flex; flex-direction: column; gap: 6px;
        }
        .log-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #3b82f6; text-transform: uppercase; margin-bottom: 4px; }
        .log-empty { font-size: 12px; color: #334155; font-style: italic; }
        .log-entry {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #64748b;
          padding: 6px 10px;
          background: #060b14;
          border-radius: 6px;
          border: 1px solid #1e293b;
          transition: all 0.3s;
          line-height: 1.5;
        }
        .log-entry.fresh { border-color: #3b82f6; color: #93c5fd; }

        /* Summary */
        .summary {
          background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08));
          border: 1.5px solid rgba(99,102,241,0.25);
          border-radius: 20px;
          padding: 28px 32px;
        }
        .summary-title { font-size: 18px; font-weight: 800; color: #e2e8f4; margin-bottom: 20px; }
        .cheatsheet { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 600px) { .cheatsheet { grid-template-columns: 1fr; } }
        .cs-item {
          background: #060b14;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 14px 16px;
        }
        .cs-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #60a5fa;
          margin-bottom: 4px;
        }
        .cs-desc { font-size: 12px; color: #64748b; }
      `}</style>

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
              <div className="progress-fill" style={{ width: `${(completed.length / lessons.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {lessons.map((l, i) => (
            <button key={l.id} className={`tab ${activeLesson === i ? "active" : ""}`} onClick={() => setActiveLesson(i)}>
              {completed.includes(i)
                ? <span className="tab-check">✓</span>
                : <span className="tab-num">{i + 1}</span>
              }
              {l.icon} {l.title.split("(")[0].trim()}
            </button>
          ))}
          <button className={`tab ${activeLesson === 4 ? "active" : ""}`} onClick={() => setActiveLesson(4)}>
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
              <button className="btn-prev" disabled={activeLesson === 0} onClick={() => setActiveLesson((p) => p - 1)}>
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
                {[
                  { code: "io('http://localhost:5000')", desc: "Connect to Socket.io server" },
                  { code: "socket.on('connect', fn)", desc: "Fires when connection is established" },
                  { code: "socket.emit('event', data)", desc: "Send data to the server" },
                  { code: "socket.on('event', fn)", desc: "Receive data from the server" },
                  { code: "socket.off('event')", desc: "Remove a specific event listener" },
                  { code: "socket.disconnect()", desc: "Manually close the connection" },
                  { code: "socket.id", desc: "Unique ID assigned by server" },
                  { code: "useRef + useEffect([], [])", desc: "Correct React socket pattern" },
                ].map((item, i) => (
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
    </>
  );
}