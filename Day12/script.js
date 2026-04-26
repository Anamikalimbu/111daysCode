// ===========================
//   RETRO ARCADE TIC TAC TOE
//   With Minimax AI
// ===========================

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ---- State ----
let board        = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver     = false;
let vsAI         = false;        // true = AI mode
let difficulty   = 'medium';    // 'easy' | 'medium' | 'hard'
let aiThinking   = false;
let scores       = { X: 0, O: 0, D: 0 };

// ---- DOM ----
const cells        = document.querySelectorAll('.cell');
const boardEl      = document.getElementById('board');
const statusBar    = document.querySelector('.status-bar');
const statusEl     = document.getElementById('status');
const xScoreEl     = document.getElementById('x-score');
const oScoreEl     = document.getElementById('o-score');
const drawScoreEl  = document.getElementById('draw-score');
const labelX       = document.getElementById('label-x');
const labelO       = document.getElementById('label-o');
const scoreXCard   = document.getElementById('score-x');
const scoreOCard   = document.getElementById('score-o');
const restartBtn   = document.getElementById('restart-btn');
const resetBtn     = document.getElementById('reset-score-btn');
const overlay      = document.getElementById('overlay');
const overlayIcon  = document.getElementById('overlay-icon');
const overlayTitle = document.getElementById('overlay-title');
const overlayMsg   = document.getElementById('overlay-msg');
const overlayBtn   = document.getElementById('overlay-btn');
const diffRow      = document.getElementById('difficulty-row');
const modeBtns     = document.querySelectorAll('.mode-btn');
const diffBtns     = document.querySelectorAll('.diff-btn');

// ---- Mode buttons ----
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    vsAI = btn.dataset.mode === 'ai';

    // Show/hide difficulty
    diffRow.classList.toggle('visible', vsAI);

    // Update labels
    labelO.textContent = vsAI ? '🤖 AI' : 'PLAYER O';
    scoreOCard.classList.toggle('ai-mode', vsAI);
    boardEl.classList.toggle('ai-active', vsAI);

    scores = { X: 0, O: 0, D: 0 };
    updateScoreDisplay();
    init();
  });
});

// ---- Difficulty buttons ----
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    diffBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    difficulty = btn.dataset.diff;
    scores = { X: 0, O: 0, D: 0 };
    updateScoreDisplay();
    init();
  });
});

// ---- Init ----
function init() {
  board = Array(9).fill(null);
  gameOver  = false;
  aiThinking = false;
  currentPlayer = 'X';

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });

  boardEl.classList.remove('locked');
  overlay.classList.remove('active');
  updateStatus();
  updateScoreHighlight();
}

// ---- Cell click ----
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const idx = parseInt(cell.dataset.index);
    if (gameOver || aiThinking || board[idx]) return;
    // In AI mode O is AI — block human from clicking for O
    if (vsAI && currentPlayer === 'O') return;

    placeMove(idx, currentPlayer);
  });
});

// ---- Place a move ----
function placeMove(idx, player) {
  board[idx] = player;
  const cell = cells[idx];
  cell.textContent = player;
  cell.classList.add('taken', player.toLowerCase());

  const winner = checkWinner();
  if (winner) {
    endGame('win', player, winner.combo);
    return;
  }
  if (board.every(Boolean)) {
    endGame('draw');
    return;
  }

  currentPlayer = player === 'X' ? 'O' : 'X';
  updateStatus();
  updateScoreHighlight();

  // Trigger AI move
  if (vsAI && currentPlayer === 'O' && !gameOver) {
    scheduleAI();
  }
}

// ---- AI scheduling ----
function scheduleAI() {
  aiThinking = true;
  boardEl.classList.add('locked');
  showThinking();

  const delay = 420 + Math.random() * 300;
  setTimeout(() => {
    const move = getAIMove();
    aiThinking = false;
    boardEl.classList.remove('locked');
    if (move !== -1) placeMove(move, 'O');
  }, delay);
}

// ---- AI move selection ----
function getAIMove() {
  const empty = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
  if (!empty.length) return -1;

  if (difficulty === 'easy') {
    // 70% random, 30% smart
    if (Math.random() < 0.70) return empty[Math.floor(Math.random() * empty.length)];
    return bestMove(2);
  }
  if (difficulty === 'medium') {
    // Always block immediate win; 50% otherwise random
    const block = findBlockOrWin();
    if (block !== -1) return block;
    if (Math.random() < 0.50) return empty[Math.floor(Math.random() * empty.length)];
    return bestMove(4);
  }
  // hard — full minimax
  return bestMove(9);
}

// Block immediate wins / take immediate wins (medium shortcut)
function findBlockOrWin() {
  // First check if AI can win
  for (const [a, b, c] of WINNING_COMBOS) {
    const line = [board[a], board[b], board[c]];
    if (line.filter(v => v === 'O').length === 2 && line.includes(null)) {
      return [a, b, c][line.indexOf(null)];
    }
  }
  // Then block human
  for (const [a, b, c] of WINNING_COMBOS) {
    const line = [board[a], board[b], board[c]];
    if (line.filter(v => v === 'X').length === 2 && line.includes(null)) {
      return [a, b, c][line.indexOf(null)];
    }
  }
  return -1;
}

// ---- Minimax ----
function bestMove(depth) {
  let best = -Infinity, idx = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = 'O';
    const score = minimax(board, depth - 1, false, -Infinity, Infinity);
    board[i] = null;
    if (score > best) { best = score; idx = i; }
  }
  return idx;
}

function minimax(b, depth, isMax, alpha, beta) {
  const result = evalBoard(b);
  if (result !== null || depth === 0) return result ?? 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = 'O';
      best = Math.max(best, minimax(b, depth - 1, false, alpha, beta));
      b[i] = null;
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = 'X';
      best = Math.min(best, minimax(b, depth - 1, true, alpha, beta));
      b[i] = null;
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function evalBoard(b) {
  for (const [a, c, d] of WINNING_COMBOS) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return b[a] === 'O' ? 10 : -10;
    }
  }
  if (b.every(Boolean)) return 0;
  return null; // game ongoing
}

// ---- Check winner on live board ----
function checkWinner() {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], combo };
    }
  }
  return null;
}

// ---- End game ----
function endGame(type, player, combo) {
  gameOver = true;
  boardEl.classList.add('locked');

  if (type === 'win') {
    highlightWinners(combo);
    scores[player]++;
    updateScoreDisplay();
    setTimeout(() => showOverlay('win', player), 500);
  } else {
    scores.D++;
    updateScoreDisplay();
    setTimeout(() => showOverlay('draw'), 300);
  }
}

function highlightWinners(combo) {
  combo.forEach(i => cells[i].classList.add('winner'));
}

// ---- Overlay ----
function showOverlay(type, player) {
  overlayIcon.className = 'overlay-icon';

  if (type === 'win') {
    const isAI = vsAI && player === 'O';
    if (player === 'X') {
      overlayIcon.textContent = 'X';
      overlayIcon.classList.add('x-icon');
      overlayTitle.textContent = 'WINNER!';
      overlayMsg.textContent = vsAI ? 'YOU WIN! 🎉' : 'PLAYER X WINS THE ROUND!';
    } else if (isAI) {
      overlayIcon.textContent = '🤖';
      overlayIcon.classList.add('ai-icon');
      overlayTitle.textContent = 'GAME OVER';
      overlayMsg.textContent = 'AI WINS THIS ROUND!';
    } else {
      overlayIcon.textContent = 'O';
      overlayIcon.classList.add('o-icon');
      overlayTitle.textContent = 'WINNER!';
      overlayMsg.textContent = 'PLAYER O WINS THE ROUND!';
    }
  } else {
    overlayIcon.textContent = 'DRAW';
    overlayIcon.classList.add('draw-icon');
    overlayTitle.textContent = 'DRAW!';
    overlayMsg.textContent = 'NO WINNER THIS ROUND';
  }

  overlay.classList.add('active');
}

// ---- Status ----
function updateStatus() {
  if (vsAI && currentPlayer === 'O') {
    statusBar.className = 'status-bar status-ai';
    statusEl.innerHTML = `<span class="thinking-dots">AI THINKING<span>.</span><span>.</span><span>.</span></span>`;
  } else {
    statusBar.className = `status-bar status-${currentPlayer.toLowerCase()}`;
    statusEl.innerHTML = `PLAYER <span id="current-player">${currentPlayer}</span>'S TURN`;
  }
}

function showThinking() {
  statusBar.className = 'status-bar status-ai';
  statusEl.innerHTML = `<span class="thinking-dots">AI THINKING<span>.</span><span>.</span><span>.</span></span>`;
}

function updateScoreHighlight() {
  scoreXCard.classList.remove('active-x', 'active-o');
  scoreOCard.classList.remove('active-x', 'active-o');
  if (currentPlayer === 'X') scoreXCard.classList.add('active-x');
  else scoreOCard.classList.add('active-o');
}

function updateScoreDisplay() {
  xScoreEl.textContent   = scores.X;
  oScoreEl.textContent   = scores.O;
  drawScoreEl.textContent = scores.D;
}

// ---- Buttons ----
restartBtn.addEventListener('click', init);
overlayBtn.addEventListener('click', init);
resetBtn.addEventListener('click', () => {
  scores = { X: 0, O: 0, D: 0 };
  updateScoreDisplay();
  init();
});

// ---- Start ----
init();