import { FiEdit2, FiTrash2, FiCheck, FiClock } from 'react-icons/fi';

const priorityStyles = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr, completed) {
  if (!dateStr || completed) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(todo.dueDate, todo.completed);

  return (
    <div className={`card flex items-start gap-3 p-4 transition ${todo.completed ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onToggle(todo._id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          todo.completed
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-slate-300 hover:border-brand-500'
        }`}
        aria-label="Toggle complete"
      >
        {todo.completed && <FiCheck size={13} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-sm font-medium text-slate-800 ${todo.completed ? 'line-through' : ''}`}>
            {todo.title}
          </h3>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${priorityStyles[todo.priority]}`}>
            {todo.priority}
          </span>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
            {todo.category}
          </span>
        </div>

        {todo.description && (
          <p className="mt-1 text-sm text-slate-500">{todo.description}</p>
        )}

        {todo.dueDate && (
          <div className={`mt-1 flex items-center gap-1 text-xs ${overdue ? 'text-rose-600' : 'text-slate-400'}`}>
            <FiClock size={12} />
            {formatDate(todo.dueDate)} {overdue && '· overdue'}
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onEdit(todo)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Edit todo"
        >
          <FiEdit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(todo._id)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          aria-label="Delete todo"
        >
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
}
