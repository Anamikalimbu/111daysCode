
import { useState } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import AddTask from './components/AddTask';
import FilterTabs from './components/FilterTabs';
import TaskList from './components/TaskList';
import Footer from './components/Footer';

/* ── Pre-loaded tasks (each has a unique id for key) ── */
const INITIAL_TASKS = [
  { id: 1, text: 'Learn React Lists & map()', completed: true, priority: 'high' },
  { id: 2, text: 'Understand the role of Keys', completed: true, priority: 'high' },
  { id: 3, text: 'Practice conditional rendering', completed: false, priority: 'high' },
  { id: 4, text: 'Build Task Manager mini project', completed: false, priority: 'medium' },
  { id: 5, text: 'Style completed vs pending tasks', completed: false, priority: 'medium' },
  { id: 6, text: 'Add delete & toggle functionality', completed: false, priority: 'low' },
  { id: 7, text: 'Push Day 27 to GitHub', completed: false, priority: 'low' },
];

function App() {
  /* ── State management ── */
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [nextId, setNextId] = useState(INITIAL_TASKS.length + 1);

  /* ── Derived stats (computed from state) ── */
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  /* ── Add a new task (updating array with spread) ── */
  const handleAddTask = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTask = {
      id: nextId,
      text: trimmed,
      completed: false,
      priority: 'medium',
    };

    // Immutable array update — spread existing + add new
    setTasks((prev) => [...prev, newTask]);
    setNextId((prev) => prev + 1);
    setInputValue('');
  };

  /* ── Toggle complete/undo (updating array with map) ── */
  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /* ── Delete a task (updating array with filter) ── */
  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /* ── Filter tasks based on active tab ── */
  const getFilteredTasks = () => {
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    if (filter === 'pending') return tasks.filter((t) => !t.completed);
    return tasks; // 'all'
  };

  return (
    <div className="app-container" id="app-container">
      <Header />

      <StatsBar
        total={tasks.length}
        completed={completedCount}
        pending={pendingCount}
      />

      <AddTask
        inputValue={inputValue}
        onInputChange={setInputValue}
        onAdd={handleAddTask}
      />

      <FilterTabs
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <TaskList
        tasks={getFilteredTasks()}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      <Footer />
    </div>
  );
}

export default App;
