/* ============================================
   Header Component
   Displays game logo and Day 29 badge
   ============================================ */

const Header = () => {
  return (
    <header className="header" id="game-header">
      <div className="header__logo">
        <span className="header__icon">🧠</span>
        <div>
          <h1 className="header__title">Memory Card Game</h1>
          <span className="header__subtitle">AI Performance Coach</span>
        </div>
      </div>
      <div className="header__badge">
        <span>🎯</span>
        <span>Day 29 Challenge</span>
      </div>
    </header>
  );
};

export default Header;
