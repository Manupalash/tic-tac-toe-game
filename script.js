const modeSelection = document.getElementById('mode-selection');
const playerSelection = document.getElementById('player-selection');
const gameScreen = document.getElementById('game-screen');
const multiplayerBtn = document.getElementById('multiplayerBtn');
const aiBtn = document.getElementById('aiBtn');
const chooseXBtn = document.getElementById('chooseX');
const chooseOBtn = document.getElementById('chooseO');
const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const changeModeButton = document.getElementById('changeMode');
const xScoreSpan = document.getElementById('xScore');
const oScoreSpan = document.getElementById('oScore');
const drawScoreSpan = document.getElementById('drawScore');

let currentPlayer;
let playerSymbol;
let gameActive = false;
let isAIMode = false;
let isAITurn = false;

const scores = {
    X: 0,
    O: 0,
    draws: 0
};

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function initGame() {
    modeSelection.classList.remove('hidden');
    playerSelection.classList.add('hidden');
    gameScreen.classList.add('hidden');
}

function chooseMode(mode) {
    isAIMode = mode === 'ai';
    modeSelection.classList.add('hidden');
    if (isAIMode) {
        playerSelection.classList.remove('hidden');
    } else {
        startGame();
    }
}

function choosePlayer(symbol) {
    playerSymbol = symbol;
    playerSelection.classList.add('hidden');
    startGame();
}

function startGame() {
    gameScreen.classList.remove('hidden');
    currentPlayer = 'X';
    gameActive = true;
    isAITurn = false;
    message.textContent = isAIMode ? "Game started. Your turn!" : "Multiplayer mode: X's turn";
    restartGame();
}

multiplayerBtn.addEventListener('click', () => chooseMode('multiplayer'));
aiBtn.addEventListener('click', () => chooseMode('ai'));
chooseXBtn.addEventListener('click', () => choosePlayer('X'));
chooseOBtn.addEventListener('click', () => choosePlayer('O'));

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (cell.textContent !== '' || !gameActive || isAITurn) return;

    makeMove(cell, cellIndex);

    if (isAIMode && gameActive && currentPlayer !== playerSymbol) {
        isAITurn = true;
        message.textContent = "AI is thinking...";
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(cell, cellIndex) {
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'player-x' : 'player-o');
    if (checkWin()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isAIMode) {
            message.textContent = currentPlayer === playerSymbol ? "Your turn" : "AI's turn";
        } else {
            message.textContent = `${currentPlayer}'s turn`;
        }
    }
}

function makeAIMove() {
    const emptyCells = [...cells].filter(cell => cell.textContent === '');
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cellIndex = Array.from(cells).indexOf(randomCell);
        makeMove(randomCell, cellIndex);
    }
    isAITurn = false;
    if (gameActive) {
        message.textContent = "Your turn";
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        });
    });
}

function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        message.textContent = "It's a draw!";
        scores.draws++;
        drawScoreSpan.textContent = scores.draws;
    } else {
        if (isAIMode && currentPlayer !== playerSymbol) {
            message.textContent = "AI wins!";
        } else {
            message.textContent = `Player ${currentPlayer} wins!`;
        }
        scores[currentPlayer]++;
        if (currentPlayer === 'X') {
            xScoreSpan.textContent = scores.X;
        } else {
            oScoreSpan.textContent = scores.O;
        }
    }
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    isAITurn = false;
    if (isAIMode) {
        message.textContent = playerSymbol === 'X' ? "Game restarted. Your turn!" : "Game restarted. AI's turn...";
    } else {
        message.textContent = "Multiplayer mode: X's turn";
    }
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('player-x', 'player-o');
    });

    if (isAIMode && playerSymbol === 'O') {
        isAITurn = true;
        setTimeout(makeAIMove, 500);
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
changeModeButton.addEventListener('click', initGame);

initGame();
