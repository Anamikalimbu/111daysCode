
import { useState } from 'react';

function TaskItem({ task, onToggle, onDelete }) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  return (
    <div
      id={`task-${task.id}`}
      className={
        'task-item' +
        (task.completed ? ' task-item--completed' : '') +
        (removing ? ' task-item--removing' : '')
      }
    >
      {/* Custom checkbox — conditional styling based on state */}
      <div
        className="task-item__checkbox"
        onClick={() => onToggle(task.id)}
        role="checkbox"
        aria-checked={task.completed}
        tabIndex={0}
      />

      {/* Task text */}
      <span className="task-item__text">{task.text}</span>

      {/* Logical AND (&&): only render priority badge if priority exists */}
      {task.priority && (
        <span className={`task-item__priority task-item__priority--${task.priority}`}>
          {task.priority}
        </span>
      )}

      {/* Action buttons */}
      <div className="task-item__actions">
        {/* Ternary: show undo or complete button */}
        {task.completed ? (
          <button
            className="task-item__btn task-item__btn--undo"
            onClick={() => onToggle(task.id)}
            title="Undo"
          >
            ↩
          </button>
        ) : (
          <button
            className="task-item__btn task-item__btn--complete"
            onClick={() => onToggle(task.id)}
            title="Complete"
          >
            ✓
          </button>
        )}
        <button
          className="task-item__btn task-item__btn--delete"
          onClick={handleDelete}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
