import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
  const { dispatch } = useContext(TodoContext);

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div 
        className="todo-text"
        onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
      >
        <span className="checkbox">
          {todo.completed ? '✓' : ''}
        </span>
        <span className="text-content">{todo.text}</span>
      </div>
      <button
        className="delete-btn"
        onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
        aria-label="Delete todo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </li>
  );
};

export default TodoItem;
