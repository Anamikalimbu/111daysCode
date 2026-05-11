
function StatsBar({ total, completed, pending }) {
  return (
    <div className="stats-bar" id="stats-bar">
      <div className="stat-card">
        <div className="stat-card__value">{total}</div>
        <div className="stat-card__label">Total</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value stat-card__value--success">{completed}</div>
        <div className="stat-card__label">Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value stat-card__value--danger">{pending}</div>
        <div className="stat-card__label">Pending</div>
      </div>
    </div>
  );
}

export default StatsBar;
