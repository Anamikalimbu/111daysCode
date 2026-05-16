import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { TodoProvider } from './context/TodoContext';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <div className="app-container">
        <div className="app-wrapper">
          <header className="app-header">
            <div className="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <h1>Task Master</h1>
            <p className="subtitle">Manage your tasks globally with useReducer & Context API</p>
          </header>
          <main className="app-main">
            <TodoForm />
            <TodoList />
          </main>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
