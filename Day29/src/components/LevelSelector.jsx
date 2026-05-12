const LEVELS = [
  {
    name: 'Easy',
    emoji: '🌱',
    info: '6 pairs • 12 cards\n4×3 Grid • Relaxed pace',
    className: 'level-card--easy',
  },
  {
    name: 'Medium',
    emoji: '⚡',
    info: '8 pairs • 16 cards\n4×4 Grid • Balanced challenge',
    className: 'level-card--medium',
  },
  {
    name: 'Hard',
    emoji: '🔥',
    info: '18 pairs • 36 cards\n6×6 Grid • Brain workout',
    className: 'level-card--hard',
  },
];

const LevelSelector = ({ onSelectLevel }) => {
  return (
    <section className="level-selector" id="level-selector">
      <h2 className="level-selector__heading">Choose Your Challenge</h2>
      <p className="level-selector__sub">
        Pick a difficulty level and test your memory!
      </p>

      <div className="level-cards">
        {LEVELS.map((level) => (
          <button
            key={level.name}
            id={`level-${level.name.toLowerCase()}`}
            className={`level-card ${level.className}`}
            onClick={() => onSelectLevel(level.name)}
          >
            <span className="level-card__emoji">{level.emoji}</span>
            <h3 className="level-card__name">{level.name}</h3>
            <p className="level-card__info">
              {level.info.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default LevelSelector;
