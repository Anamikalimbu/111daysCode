import React, { useState, useEffect } from 'react';
import InputBar from './components/InputBar';
import TaskList from './components/TaskList';
import TaskCounter from './components/TaskCounter';
import './index.css';

const App = () => {
  // Initialize tasks from localStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (text) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    setTasks([newTask, ...tasks]);
  };

  // Toggle task completion status
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Edit a task text
  const editTask = (id, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Task Master</h1>
        <p>Organize your day, achieve your goals.</p>
      </header>
      
      <main>
        <TaskCounter tasks={tasks} />
        <InputBar onAddTask={addTask} />
        <TaskList 
          tasks={tasks} 
          onToggle={toggleTask} 
          onDelete={deleteTask} 
          onEdit={editTask} 
        />
      </main>
    </div>
  );
};

export default App;
