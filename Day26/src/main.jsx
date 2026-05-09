/**
 * main.jsx — Entry point for the Multi-Step Registration Form app.
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
