const CoachReport = ({ report, stats, onPlayAgain, onChangeLevel, onPlayRecommended }) => {
  const { summary, rating, motivation, tip, nextLevel, score } = report;
  const { time, moves, mistakes } = stats;

  /**
   * Map rating to CSS class for badge styling
   */
  const ratingClass = rating.toLowerCase().replace(' ', '-');

  /**
   * Get emoji based on rating
   */
  const getRatingEmoji = () => {
    switch (rating) {
      case 'Excellent': return '🏆';
      case 'Good': return '⭐';
      case 'Average': return '👍';
      case 'Need Practice': return '💪';
      default: return '🎮';
    }
  };

  /**
   * Format time for display
   */
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="coach-overlay" id="coach-overlay">
      <div className="coach-report" id="coach-report">
        {/* Header */}
        <div className="coach-report__header">
          <span className="coach-report__emoji">🤖</span>
          <h2 className="coach-report__title">AI Coach Report</h2>
        </div>

        {/* Body */}
        <div className="coach-report__body">
          {/* Game Stats Summary */}
          <div className="game-stats-summary">
            <div className="mini-stat">
              <span className="mini-stat__value mini-stat__value--time">
                {formatTime(time)}
              </span>
              <span className="mini-stat__label">Time</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat__value mini-stat__value--moves">
                {moves}
              </span>
              <span className="mini-stat__label">Moves</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat__value mini-stat__value--mistakes">
                {mistakes}
              </span>
              <span className="mini-stat__label">Mistakes</span>
            </div>
          </div>

          {/* Rating */}
          <div className="coach-section">
            <div className="coach-section__label">
              <span>📊</span> Performance Rating
            </div>
            <span className={`rating-badge rating-badge--${ratingClass}`}>
              {getRatingEmoji()} {rating} — {score}/100
            </span>
          </div>

          {/* Summary */}
          <div className="coach-section">
            <div className="coach-section__label">
              <span>📋</span> Summary
            </div>
            <p className="coach-section__content">{summary}</p>
          </div>

          {/* Motivation */}
          <div className="coach-section">
            <div className="coach-section__label">
              <span>💬</span> Coach Says
            </div>
            <p className="motivation-text">{motivation}</p>
          </div>

          {/* Tip */}
          <div className="coach-section">
            <div className="coach-section__label">
              <span>💡</span> Improvement Tip
            </div>
            <div className="tip-box">{tip}</div>
          </div>

          {/* Next Level Recommendation */}
          <div className="coach-section">
            <div className="coach-section__label">
              <span>🎯</span> Recommended Next Level
            </div>
            <div className="next-level">
              {nextLevel === 'Easy' && '🌱'}
              {nextLevel === 'Medium' && '⚡'}
              {nextLevel === 'Hard' && '🔥'}
              {' '}{nextLevel}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="coach-report__footer">
          <button
            className="btn btn--success"
            id="btn-play-recommended"
            onClick={() => onPlayRecommended(nextLevel)}
          >
            🎯 Play {nextLevel}
          </button>
          <button
            className="btn btn--primary"
            id="btn-play-again"
            onClick={onPlayAgain}
          >
            🔄 Replay
          </button>
          <button
            className="btn btn--secondary"
            id="btn-change-level"
            onClick={onChangeLevel}
          >
            📋 Levels
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachReport;
