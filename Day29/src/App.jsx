/* ============================================
   🧠 Memory Card Game - Main App Component
   Day 29 | 111 Days MERN Challenge
   ============================================
   Features:
   - 3 difficulty levels (Easy / Medium / Hard)
   - Card flip animations with match detection
   - Live stats tracking (time, moves, mistakes)
   - AI Performance Coach with coaching report
   ============================================ */

import { useState, useEffect, useCallback, useRef } from 'react';

// Components
import Header from './components/Header';
import LevelSelector from './components/LevelSelector';
import StatsPanel from './components/StatsPanel';
import GameBoard from './components/GameBoard';
import CoachReport from './components/CoachReport';

// Utilities
import { generateCards } from './utils/cardData';
import { analyzePerformance } from './utils/aiCoach';

// Game phases
const PHASE = {
  MENU: 'menu',       // Level selection screen
  PLAYING: 'playing', // Active gameplay
  WON: 'won',         // Game completed, showing report
};

function App() {
  // ============ State Management ============
  const [phase, setPhase] = useState(PHASE.MENU);
  const [level, setLevel] = useState('Easy');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);   // Currently flipped (max 2)
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [time, setTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);       // Prevent clicks during comparison
  const [coachReport, setCoachReport] = useState(null);
  const [showWinBanner, setShowWinBanner] = useState(false);

  // Ref for timer interval
  const timerRef = useRef(null);

  // ============ Timer Logic ============
  useEffect(() => {
    if (phase === PHASE.PLAYING) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // ============ Check Win Condition ============
  useEffect(() => {
    if (phase === PHASE.PLAYING && matchedPairs > 0 && matchedPairs === totalPairs) {
      // Stop timer
      if (timerRef.current) clearInterval(timerRef.current);

      // Show win banner briefly, then show coach report
      setShowWinBanner(true);

      setTimeout(() => {
        const report = analyzePerformance({
          time,
          moves,
          mistakes,
          level,
        });

        setCoachReport(report);
        setPhase(PHASE.WON);
        setShowWinBanner(false);
      }, 1800);
    }
  }, [matchedPairs, totalPairs, phase, time, moves, mistakes, level]);

  // ============ Game Actions ============

  /**
   * Start a new game with the selected level
   */
  const startGame = useCallback((selectedLevel) => {
    const newCards = generateCards(selectedLevel);
    const pairs = newCards.length / 2;

    setLevel(selectedLevel);
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMistakes(0);
    setMatchedPairs(0);
    setTotalPairs(pairs);
    setTime(0);
    setIsLocked(false);
    setCoachReport(null);
    setShowWinBanner(false);
    setPhase(PHASE.PLAYING);
  }, []);

  /**
   * Handle card flip — core game logic
   */
  const handleFlip = useCallback((cardId) => {
    if (isLocked) return;

    // Find the card
    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the card
    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    // If this is the second card flipped, check for a match
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsLocked(true); // Lock board during comparison

      const [first, second] = newFlipped;

      if (first.emoji === second.emoji) {
        // ✅ Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.emoji === first.emoji ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        // ❌ No match — flip back after delay
        setMistakes((prev) => prev + 1);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 900);
      }
    }
  }, [cards, flippedCards, isLocked]);

  /**
   * Replay the same level
   */
  const handlePlayAgain = () => startGame(level);

  /**
   * Go back to level selection
   */
  const handleChangeLevel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase(PHASE.MENU);
    setCoachReport(null);
  };

  /**
   * Play the AI-recommended level
   */
  const handlePlayRecommended = (recommendedLevel) => startGame(recommendedLevel);

  // ============ Render ============
  return (
    <>
      <Header />

      {/* Phase: Level Selection */}
      {phase === PHASE.MENU && (
        <LevelSelector onSelectLevel={startGame} />
      )}

      {/* Phase: Active Gameplay */}
      {phase === PHASE.PLAYING && (
        <div className="game-container">
          <StatsPanel
            time={time}
            moves={moves}
            mistakes={mistakes}
            level={level}
          />

          {/* Win Banner (brief animation before report) */}
          {showWinBanner && (
            <div className="win-banner">
              <span className="win-banner__emoji">🎉</span>
              <h2 className="win-banner__text">You Did It!</h2>
              <p className="win-banner__sub">Analyzing your performance...</p>
            </div>
          )}

          {/* Card Grid */}
          {!showWinBanner && (
            <GameBoard
              cards={cards}
              onFlip={handleFlip}
              disabled={isLocked}
              level={level}
            />
          )}

          {/* Game Controls */}
          <div className="game-controls">
            <button
              className="btn btn--secondary"
              id="btn-restart"
              onClick={handlePlayAgain}
            >
              🔄 Restart
            </button>
            <button
              className="btn btn--secondary"
              id="btn-back-menu"
              onClick={handleChangeLevel}
            >
              ◀ Back
            </button>
          </div>
        </div>
      )}

      {/* Phase: Game Won — Show AI Coach Report */}
      {phase === PHASE.WON && coachReport && (
        <CoachReport
          report={coachReport}
          stats={{ time, moves, mistakes }}
          onPlayAgain={handlePlayAgain}
          onChangeLevel={handleChangeLevel}
          onPlayRecommended={handlePlayRecommended}
        />
      )}
    </>
  );
}

export default App;
