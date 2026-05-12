const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const StatsPanel = ({ time, moves, mistakes, level }) => {
  return (
    <div className="stats-bar" id="stats-panel">
      <div className="stat-item">
        <span className="stat-item__icon">⏱️</span>
        <div>
          <div className="stat-item__label">Time</div>
          <div className="stat-item__value stat-item__value--time">
            {formatTime(time)}
          </div>
        </div>
      </div>

      <div className="stat-item">
        <span className="stat-item__icon">👆</span>
        <div>
          <div className="stat-item__label">Moves</div>
          <div className="stat-item__value stat-item__value--moves">{moves}</div>
        </div>
      </div>

      <div className="stat-item">
        <span className="stat-item__icon">❌</span>
        <div>
          <div className="stat-item__label">Mistakes</div>
          <div className="stat-item__value stat-item__value--mistakes">
            {mistakes}
          </div>
        </div>
      </div>

      <div className="stat-item">
        <span className="stat-item__icon">📊</span>
        <div>
          <div className="stat-item__label">Level</div>
          <div className="stat-item__value stat-item__value--level">{level}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
