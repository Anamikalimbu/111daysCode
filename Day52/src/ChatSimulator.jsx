import { useState, useEffect, useRef } from "react";
import { SIMULATED_USERS, SIMULATED_MESSAGES } from "./lessons.js";

export default function ChatSimulator() {
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