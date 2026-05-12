
// Emoji sets for each difficulty level
const CARD_SETS = {
  Easy: ['🦊', '🐼', '🦄', '🐸', '🦋', '🐙'],          // 6 pairs = 12 cards (4×3)
  Medium: ['🦊', '🐼', '🦄', '🐸', '🦋', '🐙', '🦁', '🐳'],  // 8 pairs = 16 cards (4×4)
  Hard: ['🦊', '🐼', '🦄', '🐸', '🦋', '🐙', '🦁', '🐳', '🌺', '🍄', '🎯', '🚀', '🌙', '🔮', '💎', '🎪', '🧊', '🍭'],  // 18 pairs = 36 cards (6×6)
};

/**
 * Fisher-Yates Shuffle Algorithm
 * Randomizes the order of cards for each new game
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate a shuffled deck of card pairs for the given level
 * Each card object has: id, emoji, isFlipped, isMatched
 */
export const generateCards = (level) => {
  const emojis = CARD_SETS[level] || CARD_SETS.Easy;

  // Create pairs: each emoji appears twice
  const pairs = emojis.flatMap((emoji, index) => [
    { id: index * 2, emoji, isFlipped: false, isMatched: false },
    { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false },
  ]);

  return shuffleArray(pairs);
};

/**
 * Get grid configuration based on level
 */
export const getGridConfig = (level) => {
  switch (level) {
    case 'Easy':
      return { cols: 4, rows: 3, total: 12 };
    case 'Medium':
      return { cols: 4, rows: 4, total: 16 };
    case 'Hard':
      return { cols: 6, rows: 6, total: 36 };
    default:
      return { cols: 4, rows: 3, total: 12 };
  }
};

export default CARD_SETS;
