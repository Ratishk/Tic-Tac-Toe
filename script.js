// The Tic Tac Toe board
let board = Array(9).fill('');

// Constants for players' moves
const PLAYER_X = 'X';
const PLAYER_O = 'O';

// Flag to keep track of current player
let currentPlayer = PLAYER_X;

// Flag to keep track of game over
let gameOver = false;

// Winning combinations
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

// Flag to keep track of game mode
let gameMode = '';

// Function to check for a winning condition
function checkWin(board, player) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

// Function to check if the board is full
function isBoardFull(board) {
  return board.every(cell => cell !== '');
}

// Function to make a move
function makeMove(idx) {
  if (gameOver || board[idx] !== '') {
    return;
  }

  board[idx] = currentPlayer;
  const cell = document.getElementById('board').children[idx];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === PLAYER_X ? 'x' : 'o');

  if (checkWin(board, currentPlayer)) {
    gameOver = true;
    announceWinner(`Player ${currentPlayer} wins!`);
  } else if (isBoardFull(board)) {
    gameOver = true;
    announceWinner("It's a tie!");
  } else {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    updateTurnText();

    if (gameMode === 'ai' && currentPlayer === PLAYER_O) {
      makeAiMove();
    }
  }
}

// Function to update the turn text
function updateTurnText() {
  const turnText = document.getElementById('turn');
  turnText.textContent = `Player ${currentPlayer}'s turn`;
}

// Function to announce the winner
function announceWinner(message) {
  const turnText = document.getElementById('turn');
  turnText.textContent = message;
}

// Function to select game mode
function selectMode(mode) {
  gameMode = mode;

  const modeSelect = document.getElementById('mode-select');
  const board = document.getElementById('board');

  modeSelect.style.display = 'none';
  board.style.display = 'grid';

  if (gameMode === 'ai' && currentPlayer === PLAYER_O) {
    makeAiMove();
  } else {
    updateTurnText();
  }
}

// Function for AI to make a move
function makeAiMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = PLAYER_O;
      let score = minimax(board, 0, false);
      board[i] = '';

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  makeMove(bestMove);
}

// Minimax algorithm for AI
function minimax(board, depth, isMaximizing) {
  if (checkWin(board, PLAYER_X)) {
    return -10 + depth;
  } else if (checkWin(board, PLAYER_O)) {
    return 10 - depth;
  } else if (isBoardFull(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = PLAYER_O;
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = PLAYER_X;
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }

    return bestScore;
  }
}
