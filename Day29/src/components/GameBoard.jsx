
import Card from './Card';

const GameBoard = ({ cards, onFlip, disabled, level }) => {
  // CSS class for grid layout based on difficulty
  const gridClass = `game-board game-board--${level.toLowerCase()}`;

  return (
    <div className={gridClass} id="game-board">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onFlip={onFlip}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default GameBoard;
