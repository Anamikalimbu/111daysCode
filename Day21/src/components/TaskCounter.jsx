import React from 'react';

const TaskCounter = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  return (
    <div className="task-counters">
      <div className="counter-item">
        <span className="counter-label">Total Tasks</span>
        <span className="counter-value total">{total}</span>
      </div>
      <div className="counter-item">
        <span className="counter-label">Completed</span>
        <span className="counter-value completed">{completed}</span>
      </div>
      <div className="counter-item">
        <span className="counter-label">Pending</span>
        <span className="counter-value pending">{pending}</span>
      </div>
    </div>
  );
};

export default TaskCounter;
