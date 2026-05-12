  const Card = ({ card, onFlip, disabled }) => {
  const { id, emoji, isFlipped, isMatched } = card;

  // Build CSS class names based on card state
  const classNames = [
    'memory-card',
    isFlipped || isMatched ? 'memory-card--flipped' : '',
    isMatched ? 'memory-card--matched' : '',
    disabled ? 'memory-card--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    // Don't flip if already flipped, matched, or disabled
    if (isFlipped || isMatched || disabled) return;
    onFlip(id);
  };

  return (
    <div className={classNames} id={`card-${id}`} onClick={handleClick}>
      <div className="memory-card__inner">
        {/* Front face (hidden side - shows question mark) */}
        <div className="memory-card__face memory-card__front">
          <span className="memory-card__front-icon">?</span>
        </div>

        {/* Back face (revealed side - shows emoji) */}
        <div className="memory-card__face memory-card__back">
          {emoji}
        </div>
      </div>
    </div>
  );
};

export default Card;
