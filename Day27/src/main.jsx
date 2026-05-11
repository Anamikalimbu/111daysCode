/**
 * main.jsx — Entry point for the Task Manager app.
 * Day 27 of 111 Days MERN Challenge.
 * Renders the root <App /> component into the DOM.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
