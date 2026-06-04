export const lessons = [
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

export const SIMULATED_USERS = ["Rahul", "Priya", "Bikash", "Maya", "Dev"];

export const SIMULATED_MESSAGES = [
  "Hey! Anyone there? 👋",
  "Just joined the room!",
  "Socket.io is awesome 🚀",
  "Real-time is so cool",
  "Who else is learning MERN?",
  "This chat works! 🎉",
  "Emit away! 📡",
  "WebSockets > polling 💪",
];

export const CHEATSHEET = [
  { code: "io('http://localhost:5000')", desc: "Connect to Socket.io server" },
  { code: "socket.on('connect', fn)", desc: "Fires when connection is established" },
  { code: "socket.emit('event', data)", desc: "Send data to the server" },
  { code: "socket.on('event', fn)", desc: "Receive data from the server" },
  { code: "socket.off('event')", desc: "Remove a specific event listener" },
  { code: "socket.disconnect()", desc: "Manually close the connection" },
  { code: "socket.id", desc: "Unique ID assigned by server" },
  { code: "useRef + useEffect([], [])", desc: "Correct React socket pattern" },
];