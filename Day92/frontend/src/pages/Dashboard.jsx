import { useEffect, useMemo, useState, useCallback } from 'react';
import { FiLogOut, FiCheckCircle, FiClock, FiAlertTriangle, FiList } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import Filters from '../components/Filters';

const defaultFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: '',
  sort: 'newest',
};

function StatCard({ icon, label, value, tone }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>{icon}</div>
      <div>
        <p className="text-xl font-semibold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, highPriority: 0 });
  const [filters, setFilters] = useState(defaultFilters);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await api.get('/todos', { params });
      setTodos(data.todos);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/todos/stats/summary');
      setStats(data);
    } catch {
      // stats are non-critical; ignore failures silently
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, todos.length]);

  const categories = useMemo(() => {
    const set = new Set(todos.map((t) => t.category).filter(Boolean));
    return Array.from(set).sort();
  }, [todos]);

  const handleCreateOrUpdate = async (payload) => {
    if (editingTodo) {
      const { data } = await api.put(`/todos/${editingTodo._id}`, payload);
      setTodos((prev) => prev.map((t) => (t._id === data.todo._id ? data.todo : t)));
      setEditingTodo(null);
    } else {
      const { data } = await api.post('/todos', payload);
      setTodos((prev) => [data.todo, ...prev]);
    }
    fetchStats();
  };

  const handleToggle = async (id) => {
    const { data } = await api.patch(`/todos/${id}/toggle`);
    setTodos((prev) => prev.map((t) => (t._id === id ? data.todo : t)));
    fetchStats();
  };

  const handleDelete = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800">TaskFlow</h1>
            <p className="text-xs text-slate-500">Welcome back, {user?.name}</p>
          </div>
          <button onClick={logout} className="btn-secondary">
            <FiLogOut /> Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<FiList className="text-brand-600" />} label="Total tasks" value={stats.total} tone="bg-brand-50" />
          <StatCard icon={<FiClock className="text-amber-600" />} label="Active" value={stats.active} tone="bg-amber-50" />
          <StatCard icon={<FiCheckCircle className="text-emerald-600" />} label="Completed" value={stats.completed} tone="bg-emerald-50" />
          <StatCard icon={<FiAlertTriangle className="text-rose-600" />} label="High priority" value={stats.highPriority} tone="bg-rose-50" />
        </div>

        <TodoForm
          onSubmit={handleCreateOrUpdate}
          editingTodo={editingTodo}
          onCancelEdit={() => setEditingTodo(null)}
        />

        <Filters filters={filters} setFilters={setFilters} categories={categories} />

        {error && (
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
        )}

        <div className="space-y-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading tasks…</p>
          ) : todos.length === 0 ? (
            <div className="card p-8 text-center text-sm text-slate-400">
              No tasks match your filters yet. Add one above to get started.
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={setEditingTodo}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
