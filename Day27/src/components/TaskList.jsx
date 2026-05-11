
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onDelete }) {
  // If/else pattern: show empty state when no tasks match filter
  if (tasks.length === 0) {
    return (
      <div className="task-list" id="task-list">
        <div className="task-list__empty">
          <span className="task-list__empty-icon">📋</span>
          <p className="task-list__empty-text">No tasks here yet!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list" id="task-list">
      {/* map() renders each task — key={task.id} helps React track changes */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
