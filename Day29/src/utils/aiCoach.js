/* ============================================
   🤖 AI Performance Coach Engine
   Analyzes player stats and returns coaching feedback
   ============================================ */

/**
 * Benchmarks for each level (expected performance thresholds)
 * Used to evaluate player's time, moves, and mistakes
 */
const BENCHMARKS = {
  Easy: {
    pairs: 6,
    excellentTime: 30,
    goodTime: 50,
    avgTime: 80,
    perfectMoves: 12,   // minimum moves = pairs * 2
    goodMoves: 18,
    avgMoves: 26,
    lowMistakes: 2,
    medMistakes: 5,
  },
  Medium: {
    pairs: 8,
    excellentTime: 50,
    goodTime: 80,
    avgTime: 120,
    perfectMoves: 16,
    goodMoves: 24,
    avgMoves: 36,
    lowMistakes: 3,
    medMistakes: 7,
  },
  Hard: {
    pairs: 18,
    excellentTime: 120,
    goodTime: 200,
    avgTime: 300,
    perfectMoves: 36,
    goodMoves: 54,
    avgMoves: 80,
    lowMistakes: 6,
    medMistakes: 14,
  },
};

/**
 * Calculate a performance score (0–100) based on time, moves, and mistakes
 */
const calculateScore = (time, moves, mistakes, level) => {
  const bench = BENCHMARKS[level];

  // Time score (0–40 points)
  let timeScore;
  if (time <= bench.excellentTime) timeScore = 40;
  else if (time <= bench.goodTime) timeScore = 30;
  else if (time <= bench.avgTime) timeScore = 20;
  else timeScore = 10;

  // Moves score (0–35 points)
  let movesScore;
  if (moves <= bench.perfectMoves) movesScore = 35;
  else if (moves <= bench.goodMoves) movesScore = 28;
  else if (moves <= bench.avgMoves) movesScore = 18;
  else movesScore = 8;

  // Mistakes score (0–25 points)
  let mistakesScore;
  if (mistakes <= bench.lowMistakes) mistakesScore = 25;
  else if (mistakes <= bench.medMistakes) mistakesScore = 16;
  else mistakesScore = 6;

  return timeScore + movesScore + mistakesScore;
};

/**
 * Determine the performance rating based on score
 */
const getRating = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 40) return 'Average';
  return 'Need Practice';
};

/**
 * Generate a coaching summary based on player performance
 */
const getSummary = (time, moves, mistakes, level, rating) => {
  const bench = BENCHMARKS[level];

  if (rating === 'Excellent') {
    return `Outstanding memory skills! You completed ${level} mode in just ${time}s with only ${mistakes} mistake${mistakes !== 1 ? 's' : ''}. Your pattern recognition is exceptional.`;
  }
  if (rating === 'Good') {
    return `Solid performance on ${level} mode! Finished in ${time}s with ${moves} moves. You showed good focus and recall throughout the game.`;
  }
  if (rating === 'Average') {
    return `Nice effort on ${level} mode! You completed it in ${time}s. With ${mistakes} mistakes, there's room to sharpen your memory technique.`;
  }
  return `You completed ${level} mode in ${time}s. Don't worry — memory is a skill that improves with practice. Keep going!`;
};

/**
 * Generate a motivational message
 */
const getMotivation = (rating) => {
  const messages = {
    Excellent: [
      "You're a memory master! 🧠✨ Keep pushing your limits!",
      "Incredible focus! Your brain is firing on all cylinders! 🔥",
      "Phenomenal! You make it look effortless! 🌟",
    ],
    Good: [
      "Great job! You're building strong memory muscles! 💪",
      "Keep it up! You're on the path to mastery! 🚀",
      "Well played! Your concentration is improving! 🎯",
    ],
    Average: [
      "Every game makes you better! Keep practicing! 🌱",
      "Nice try! Your memory will sharpen with each round! ✨",
      "Good effort! Consistency is the key to progress! 💫",
    ],
    'Need Practice': [
      "Don't give up! Even memory champions started somewhere! 💪",
      "Practice makes progress! Try again and you'll improve! 🌈",
      "Keep going! Your brain gets stronger every round! 🧠",
    ],
  };

  const pool = messages[rating] || messages['Average'];
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * Generate an improvement tip based on the weakest area
 */
const getTip = (time, moves, mistakes, level) => {
  const bench = BENCHMARKS[level];

  // Find the weakest area
  const timeRatio = time / bench.avgTime;
  const movesRatio = moves / bench.avgMoves;
  const mistakesRatio = mistakes / bench.medMistakes;

  if (mistakesRatio >= timeRatio && mistakesRatio >= movesRatio) {
    return "Focus on remembering card positions before flipping new ones. Try to create a mental map of the board.";
  }
  if (timeRatio >= movesRatio) {
    return "Try to decide faster! Trust your first instinct when you think you know where a match is.";
  }
  return "Reduce unnecessary flips by pausing to recall what you've already seen before making a move.";
};

/**
 * Recommend next level based on performance
 */
const getNextLevel = (time, moves, mistakes, level, rating) => {
  if (rating === 'Excellent' || rating === 'Good') {
    if (level === 'Easy') return 'Medium';
    if (level === 'Medium') return 'Hard';
    return 'Hard'; // Already on hard, stay
  }
  if (rating === 'Need Practice') {
    if (level === 'Hard') return 'Medium';
    if (level === 'Medium') return 'Easy';
    return 'Easy'; // Already on easy, stay
  }
  // Average — stay on same level
  return level;
};

/**
 * 🤖 Main AI Coach Function
 * Analyzes player stats and returns a complete coaching report
 *
 * @param {Object} stats - Player statistics
 * @param {number} stats.time - Time in seconds
 * @param {number} stats.moves - Total moves made
 * @param {number} stats.mistakes - Number of wrong guesses
 * @param {string} stats.level - Level played (Easy/Medium/Hard)
 * @returns {Object} AI coaching report in JSON format
 */
export const analyzePerformance = ({ time, moves, mistakes, level }) => {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const score = calculateScore(time, moves, mistakes, level);
  const rating = getRating(score);

  return {
    summary: getSummary(time, moves, mistakes, level, rating),
    rating,
    motivation: getMotivation(rating),
    tip: getTip(time, moves, mistakes, level),
    nextLevel: getNextLevel(time, moves, mistakes, level, rating),
    score,   // bonus: internal score for UI display
    date,
  };
};

export default analyzePerformance;
