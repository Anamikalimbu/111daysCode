import React, { createContext, useReducer } from 'react';
import { todoReducer, initialState } from '../reducer/todoReducer';

// Create Context
export const TodoContext = createContext();

// Provider Component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ todos: state.todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
