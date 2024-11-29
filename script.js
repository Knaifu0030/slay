let gameStarted = false;
let slayTime = 0;
let roundEnded = false;
let setTimeoutIds = []; // Array to store timeout IDs

// Audio Files
const getSound = new Audio('get.mp3');
const setSound = new Audio('set.mp3');
const slaySound = new Audio('slay.mp3');

// Buttons
const player1Btn = document.getElementById('player1-btn');
const player2Btn = document.getElementById('player2-btn');
const startBtn = document.getElementById('start-btn');

// Characters
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

// Message & Winner Elements
const messageEl = document.getElementById('message');
const winnerEl = document.getElementById('winner');

startBtn.textContent = 'Start Game';

// Event Listeners for Mobile Buttons
player1Btn.addEventListener('click', () => {
    if (!roundEnded) handleInput(1);
});
player2Btn.addEventListener('click', () => {
    if (!roundEnded) handleInput(2);
});

// Event Listeners for Keypress (PC Support)
document.addEventListener('keydown', (event) => {
    if (roundEnded) return;
    if (event.key === 'a' || event.key === 'A') handleInput(1);
    if (event.key === 'l' || event.key === 'L') handleInput(2);
});

// Event Listener for Start/Play Again Button
startBtn.addEventListener('click', () => {
    startGame();
    startBtn.style.display = 'none';
});

function stopAllAudio() {
    getSound.pause();
    getSound.currentTime = 0;
    setSound.pause();
    setSound.currentTime = 0;
    slaySound.pause();
    slaySound.currentTime = 0;
    
    // Clear all pending timeouts
    setTimeoutIds.forEach(id => clearTimeout(id));
    setTimeoutIds = [];
}

function startGame() {
    if (gameStarted) return;

    // Reset all states
    roundEnded = false;
    gameStarted = true;
    slayTime = 0;

    // Reset characters to initial state
    player1.textContent = '💁‍♀️';
    player2.textContent = '💁‍♀️';

    // Start the sequence with proper timing
    messageEl.textContent = "Get...";
    getSound.play().catch(() => console.log("Browser blocked autoplay"));

    // Set after 1 second
    const setTimeoutId = setTimeout(() => {
        messageEl.textContent = "Set...";
        setSound.play();
    }, 1000);
    setTimeoutIds.push(setTimeoutId);

    // Random delay for SLAY (between 2-4 seconds after "Set")
    const randomDelay = Math.random() * 2000 + 2000;
    const slayTimeoutId = setTimeout(() => {
        messageEl.textContent = "SLAY!";
        slaySound.play();
        slayTime = performance.now();
        console.log("SLAY triggered!");
    }, 2000 + randomDelay); // 2000 = waiting for Get and Set
    setTimeoutIds.push(slayTimeoutId);
}

function handleInput(player) {
    if (!gameStarted || roundEnded) return;

    if (slayTime === 0) {
        // Player pressed too early
        roundEnded = true;
        stopAllAudio(); // Stop all audio when someone presses early
        
        const loser = player;
        const winner = player === 1 ? 2 : 1;
        
        // Update emojis
        document.getElementById(`player${loser}`).textContent = '💀';
        document.getElementById(`player${winner}`).textContent = '💅';
        
        messageEl.textContent = `Player ${loser} pressed too early! Player ${winner} WINS!`;
        gameStarted = false;
        startBtn.textContent = 'Play Again';
        startBtn.style.display = 'block';
        return;
    }

    // Set roundEnded immediately to prevent multiple inputs
    roundEnded = true;
    
    const reactionTime = performance.now() - slayTime;
    console.log(`Player ${player} reacted in ${reactionTime.toFixed(2)}ms`);
    declareWinner(player, reactionTime);
}

function declareWinner(player, reactionTime) {
    const winner = player === 1 ? "Player 1" : "Player 2";
    
    // Get player elements
    const winnerEl = document.getElementById(`player${player}`);
    const loserEl = document.getElementById(`player${player === 1 ? '2' : '1'}`);
    
    // Update emojis
    winnerEl.textContent = '💅';
    loserEl.textContent = '💀';
    
    // Show winner message
    messageEl.textContent = `${winner} SLAYS! Reaction Time: ${reactionTime.toFixed(2)}ms`;
    
    // Reset game state and show Play Again button
    gameStarted = false;
    startBtn.textContent = 'Play Again';
    startBtn.style.display = 'block';
    
    // Reset emojis after a delay
    setTimeout(() => {
        if (!gameStarted) {
            winnerEl.textContent = '💁‍♀️';
            loserEl.textContent = '💁‍♀️';
        }
    }, 3000);
}
