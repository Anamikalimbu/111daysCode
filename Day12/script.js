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