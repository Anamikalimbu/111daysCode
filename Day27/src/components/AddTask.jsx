
function AddTask({ inputValue, onInputChange, onAdd }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAdd();
    }
  };

  return (
    <div className="add-task" id="add-task-section">
      <input
        id="add-task-input"
        className="add-task__input"
        type="text"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <button
        id="add-task-btn"
        className="add-task__btn"
        onClick={onAdd}
        disabled={!inputValue.trim()}
      >
        + Add Task
      </button>
    </div>
  );
}

export default AddTask;
