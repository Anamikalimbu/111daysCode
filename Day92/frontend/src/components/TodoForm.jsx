import { useState, useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'general',
  dueDate: '',
};

export default function TodoForm({ onSubmit, editingTodo, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title: editingTodo.title || '',
        description: editingTodo.description || '',
        priority: editingTodo.priority || 'medium',
        category: editingTodo.category || 'general',
        dueDate: editingTodo.dueDate ? editingTodo.dueDate.slice(0, 10) : '',
      });
      setExpanded(true);
    }
  }, [editingTodo]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setExpanded(false);
    onCancelEdit?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate || null,
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="flex gap-2">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          onFocus={() => setExpanded(true)}
          placeholder="Add a new task…"
          className="input"
          required
        />
        <button type="submit" className="btn-primary shrink-0" disabled={submitting}>
          <FiPlus /> {editingTodo ? 'Save' : 'Add'}
        </button>
        {expanded && (
          <button type="button" onClick={resetForm} className="btn-secondary shrink-0">
            <FiX />
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={2}
            className="input sm:col-span-2"
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. work, personal"
              className="input"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Due date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      )}
    </form>
  );
}
