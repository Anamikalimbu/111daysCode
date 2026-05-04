import React, { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEditSubmit = (e) => {
    if (e) e.preventDefault();
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
      setIsEditing(false);
    } else {
      // Revert if empty
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        
        {isEditing ? (
          <form onSubmit={handleEditSubmit} style={{ flexGrow: 1 }}>
            <input
              type="text"
              className="edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </form>
        ) : (
          <span className="task-text" onDoubleClick={() => setIsEditing(true)}>
            {task.text}
          </span>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <button className="icon-btn save" onClick={handleEditSubmit} title="Save">
            💾
          </button>
        ) : (
          <button className="icon-btn edit" onClick={() => setIsEditing(true)} title="Edit">
            ✏️
          </button>
        )}
        <button className="icon-btn delete" onClick={() => onDelete(task.id)} title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
