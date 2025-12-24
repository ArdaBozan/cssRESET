// Game State
const gameState = {
    currentScreen: 'welcome',
    selectedMap: null,
    score: 0,
    time: 120,
    gameRunning: false,
    gamePaused: false,
    gameLoop: null,
    timerInterval: null,
    lastBonusCheck: 0
};

// Game Objects
const items = [
    { name: 'Snowflake', points: 5, file: 'Type=Snowflake.svg' },
    { name: 'Christmas Stocking', points: 10, file: 'Type=Christmas Stocking.svg' },
    { name: 'Winter Beanie', points: 10, file: 'Type=Winter Beanie.svg' },
    { name: 'Gingerbread Man', points: 10, file: 'Type=Gingerbread Man.svg' },
    { name: 'Cookie', points: 10, file: 'Type=Cookie.svg' },
    { name: 'Winter Mitten', points: 10, file: 'Type=Winter Mitten.svg' },
    { name: 'Gift Box', points: 15, file: 'Type=Gift Box.svg' },
    { name: 'Lollipop Candy', points: 15, file: 'Type=Lollipop Candy.svg' },
    { name: 'Christmas Sweater', points: 15, file: 'Type=Christmas Sweater.svg' },
    { name: 'Snow Globe', points: 20, file: 'Type=Snow Globe.svg' },
    { name: 'Snowman', points: 20, file: 'Type=Snowman.svg' },
    { name: 'Ice Skate', points: 20, file: 'Type=Ice Skate.svg' },
    { name: 'Football', points: 20, file: 'Type=Football.svg' },
    { name: 'Basketball', points: 20, file: 'Type=Basketball.svg' },
    { name: 'Christmas Angel', points: 25, file: 'Type=Christmas Angel.svg' },
    { name: 'Golden Star', points: 30, file: 'Type=Golden Star.svg' },
    { name: 'Laptop', points: 40, file: 'Type=Laptop.svg' },
    { name: 'Smartphone', points: 50, file: 'Type=Smartphone.svg' }
];

const bombItem = { name: 'Bomb', points: -30, file: 'Type=Bomb.svg' };

const maps = {
    'snow-village': 'wallpapers/Type=Snow Village.jpg',
    'winter-night': 'wallpapers/Type=Winter Night.jpg',
    'cozy-christmas': 'wallpapers/Type=Cozy Christmas.jpg',
    'red-noel': 'wallpapers/Type=Red Noel.jpg'
};

const santaImages = [
    'top-screen/Character=Santa - Classic.png',
    'top-screen/Character=Santa - Cheer.png',
    'top-screen/Character=Santa - Joy.png'
];

const grinchImage = 'top-screen/Character=Grinchy.png';

// Canvas and Game Objects
let canvas, ctx;
let player;
let fallingItems = [];
let frameCount = 0;
let lastSpawn = 0;

// Responsive canvas sizing
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Update player position if exists
    if (player) {
        player.containerWidth = canvas.width;
        player.containerHeight = canvas.height;
        player.updateSize();
    }
}

window.addEventListener('resize', () => {
    if (gameState.gameRunning && canvas) {
        resizeCanvas();
    }
});

// Bag images
const bagImages = {
    empty: new Image(),
    half: new Image(),
    almostFull: new Image(),
    full: new Image()
};

bagImages.empty.src = 'bag/Capasity=Empty.png';
bagImages.half.src = 'bag/Capasity=2/4.png';
bagImages.almostFull.src = 'bag/Capasity=3/4.png';
bagImages.full.src = 'bag/Capasity=Full.png';

// Preload item images
const itemImages = {};
items.forEach(item => {
    const img = new Image();
    img.src = `objects/${item.file}`;
    itemImages[item.file] = img;
});

const bombImage = new Image();
bombImage.src = `objects/${bombItem.file}`;
itemImages[bombItem.file] = bombImage;

// Player (Bag) Class
class Player {
    constructor() {
        this.containerWidth = canvas.width;
        this.containerHeight = canvas.height;
        this.updateSize();
    }
    
    updateSize() {
        // Responsive sizing based on container
        // Increased size for mobile visibility (min 90px, max 220px, or 25% of width)
        this.width = Math.max(90, Math.min(220, this.containerWidth * 0.25));
        this.height = this.width;
        this.x = this.containerWidth / 2 - this.width / 2;
        this.y = this.containerHeight - this.height - 20;
        this.speed = Math.max(8, this.containerWidth * 0.015); // Faster speed for better control
        if (!this.targetX) this.targetX = this.x;
    }

    getBagImage() {
        if (gameState.score >= 700) return bagImages.full;
        if (gameState.score >= 500) return bagImages.almostFull;
        if (gameState.score >= 300) return bagImages.half;
        return bagImages.empty;
    }

    draw() {
        const bagImg = this.getBagImage();
        if (bagImg.complete) {
            ctx.drawImage(bagImg, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        // Smooth movement
        const diff = this.targetX - this.x;
        if (Math.abs(diff) > 1) {
            this.x += diff * 0.2;
        }
        
        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.containerWidth) this.x = this.containerWidth - this.width;
    }

    moveTo(x) {
        this.targetX = x - this.width / 2;
    }
}

// Falling Item Class
class FallingItem {
    constructor(isBomb = false) {
        // Responsive sizing
        // Increased size for mobile visibility (min 50px, max 100px, or 13% of width)
        const baseSize = Math.max(50, Math.min(100, canvas.width * 0.13));
        this.width = baseSize;
        this.height = baseSize;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.isBomb = isBomb;
        
        if (isBomb) {
            this.itemData = bombItem;
            this.image = itemImages[bombItem.file];
        } else {
            // Weighted random selection (higher points = rarer)
            const weights = items.map(item => Math.max(1, 60 - item.points));
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * totalWeight;
            
            for (let i = 0; i < items.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    this.itemData = items[i];
                    this.image = itemImages[items[i].file];
                    break;
                }
            }
        }
        
        // Base speed increases with score
        const scoreSpeedMultiplier = 1 + (gameState.score / 500);
        this.speed = (3 + Math.random() * 2) * scoreSpeedMultiplier;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    draw() {
        if (this.image && this.image.complete) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        // Speed increases based on score (higher score = faster)
        const speedBonus = gameState.score * 0.001;
        this.speed += speedBonus * 0.01;
    }

    isOffScreen() {
        return this.y > canvas.height;
    }

    collidesWith(player) {
        const itemCenterX = this.x + this.width / 2;
        const itemCenterY = this.y + this.height / 2;
        
        const bagCenterX = player.x + player.width / 2;
        const bagCenterY = player.y + player.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(itemCenterX - bagCenterX, 2) + 
            Math.pow(itemCenterY - bagCenterY, 2)
        );
        
        return distance < (this.width / 2 + player.width / 3);
    }
}

// Screen Navigation
function showWelcomeScreen() {
    hideAllScreens();
    document.getElementById('welcomeScreen').classList.add('active');
    gameState.currentScreen = 'welcome';
}

function showHowToPlay() {
    hideAllScreens();
    document.getElementById('howToPlayScreen').classList.add('active');
    gameState.currentScreen = 'howToPlay';
}

function showMapSelection() {
    hideAllScreens();
    document.getElementById('mapSelectionScreen').classList.add('active');
    gameState.currentScreen = 'mapSelection';
}

function showItemsInfo() {
    hideAllScreens();
    document.getElementById('itemsInfoScreen').classList.add('active');
    gameState.currentScreen = 'itemsInfo';
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Map Selection
function selectMap(mapName) {
    gameState.selectedMap = mapName;
    
    // Update UI
    document.querySelectorAll('.map-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelector(`[data-map="${mapName}"]`).classList.add('selected');
    
    // Start game after short delay
    setTimeout(() => {
        startGame();
    }, 500);
}

// Game Functions
function startGame() {
    if (!gameState.selectedMap) {
        alert('Please select a map first!');
        return;
    }
    
    // Initialize
    hideAllScreens();
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Resize canvas to fit container
    resizeCanvas();
    
    // Set background
    const gameBg = document.getElementById('gameBackground');
    if (gameBg) {
        gameBg.style.background = `url('${maps[gameState.selectedMap]}') center/cover`;
        gameBg.style.display = 'block';
    }
    canvas.style.background = 'transparent';
    canvas.style.display = 'block';
    
    // Show HUD
    document.getElementById('gameHUD').style.display = 'flex';
    
    // Reset state
    gameState.score = 0;
    gameState.time = 120;
    gameState.gameRunning = true;
    gameState.gamePaused = false;
    gameState.lastBonusCheck = 0;
    fallingItems = [];
    frameCount = 0;
    lastSpawn = 0;
    
    // Create player
    player = new Player();
    
    // Update displays
    updateHUD();
    updateSantaImage();
    
    // Start loops
    startGameLoop();
    startTimer();
}

function startGameLoop() {
    function loop() {
        if (!gameState.gameRunning) return;
        if (!gameState.gamePaused) {
            update();
            draw();
        }
        gameState.gameLoop = requestAnimationFrame(loop);
    }
    loop();
}

function update() {
    frameCount++;
    
    // Update player keyboard movement
    updatePlayerMovement();
    
    // Spawn items
    const spawnRate = Math.max(20, 60 - Math.floor(gameState.score / 50));
    if (frameCount - lastSpawn > spawnRate) {
        const bombChance = 0.15 + (gameState.score * 0.0002);
        const isBomb = Math.random() < bombChance;
        fallingItems.push(new FallingItem(isBomb));
        lastSpawn = frameCount;
    }
    
    // Update player
    player.update();
    
    // Update falling items
    for (let i = fallingItems.length - 1; i >= 0; i--) {
        fallingItems[i].update();
        
        // Check collision
        if (fallingItems[i].collidesWith(player)) {
            const item = fallingItems[i];
            
            if (item.isBomb) {
                // Bomb hit
                gameState.score = Math.max(0, gameState.score + item.itemData.points);
                gameState.time = Math.max(0, gameState.time - 30);
                showBonusNotification('30-', true);
                updateSantaImage(true); // Show Grinch
            } else {
                // Gift caught
                gameState.score += item.itemData.points;
                
                // Check for time bonus (every 100 points) - MAX 120 seconds
                const currentBonus = Math.floor(gameState.score / 100);
                if (currentBonus > gameState.lastBonusCheck) {
                    gameState.time = Math.min(120, gameState.time + 30);
                    gameState.lastBonusCheck = currentBonus;
                    showBonusNotification('30+');
                }
            }
            
            fallingItems.splice(i, 1);
            updateHUD();
            continue;
        }
        
        // Remove off-screen items
        if (fallingItems[i].isOffScreen()) {
            fallingItems.splice(i, 1);
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw falling items
    fallingItems.forEach(item => item.draw());
    
    // Draw player
    player.draw();
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        
        gameState.time--;
        updateHUD();
        
        if (gameState.time <= 0) {
            endGame();
        }
    }, 1000);
}

function updateHUD() {
    document.getElementById('scoreValue').textContent = gameState.score;
    
    const minutes = Math.floor(gameState.time / 60);
    const seconds = gameState.time % 60;
    document.getElementById('timeValue').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}s`;
}

function updateSantaImage(showGrinch = false) {
    const santaImg = document.getElementById('santaImage');
    
    if (showGrinch) {
        santaImg.src = grinchImage;
        setTimeout(() => {
            santaImg.src = santaImages[Math.floor(Math.random() * santaImages.length)];
        }, 2000);
    } else {
        santaImg.src = santaImages[Math.floor(Math.random() * santaImages.length)];
    }
}

function showBonusNotification(text, isNegative = false) {
    const bonus = document.getElementById('bonusNotification');
    const bonusText = document.getElementById('bonusText');
    
    bonusText.textContent = text;
    bonus.style.color = isNegative ? '#ff0000' : '#FFD700';
    bonus.classList.remove('show');
    
    setTimeout(() => {
        bonus.classList.add('show');
    }, 10);
}

function togglePause() {
    gameState.gamePaused = !gameState.gamePaused;
    const pauseBtn = document.querySelector('.pause-button');
    pauseBtn.textContent = gameState.gamePaused ? '▶' : '⏸';
}

function endGame() {
    gameState.gameRunning = false;
    clearInterval(gameState.timerInterval);
    
    // Hide game elements
    canvas.style.display = 'none';
    const gameBg = document.getElementById('gameBackground');
    if (gameBg) gameBg.style.display = 'none';
    document.getElementById('gameHUD').style.display = 'none';
    
    // Show game over screen
    const gameOverScreen = document.getElementById('gameOverScreen');
    document.getElementById('finalScoreValue').textContent = gameState.score;
    gameOverScreen.classList.add('active');
}

function restartGame() {
    document.getElementById('gameOverScreen').classList.remove('active');
    startGame();
}

function backToHome() {
    document.getElementById('gameOverScreen').classList.remove('active');
    gameState.selectedMap = null;
    showWelcomeScreen();
}

// Controls
let mouseDown = false;
let touchIdentifier = null;
const keys = {
    left: false,
    right: false
};

// Keyboard controls - WASD + Arrow keys
document.addEventListener('keydown', (e) => {
    if (!gameState.gameRunning || gameState.gamePaused) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = true;
        e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = true;
        e.preventDefault();
    } else if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        e.preventDefault();
    } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Escape') {
        togglePause();
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = false;
    }
});

// Update player movement in game loop
function updatePlayerMovement() {
    if (!player) return;
    
    if (keys.left) {
        player.x -= player.speed;
        player.targetX = player.x; // Sync target to prevent snap-back
    }
    if (keys.right) {
        player.x += player.speed;
        player.targetX = player.x; // Sync target to prevent snap-back
    }
    
    // Boundaries
    if (player.x < 0) {
        player.x = 0;
        player.targetX = 0;
    }
    if (player.x + player.width > player.containerWidth) {
        player.x = player.containerWidth - player.width;
        player.targetX = player.x;
    }
}

// Controls Setup
function setupControls() {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;

    // Mouse controls
    gameCanvas.addEventListener('mousedown', (e) => {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        mouseDown = true;
        const rect = gameCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (gameCanvas.width / rect.width);
        if (player) player.moveTo(mouseX);
    });

    gameCanvas.addEventListener('mousemove', (e) => {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        if (!mouseDown) return;
        const rect = gameCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (gameCanvas.width / rect.width);
        if (player) player.moveTo(mouseX);
    });

    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    // Touch controls - Optimized for mobile
    function handleTouch(e) {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        
        const rect = gameCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        
        if (touch && player) {
            const touchX = (touch.clientX - rect.left) * (gameCanvas.width / rect.width);
            player.moveTo(touchX);
        }
    }

    gameCanvas.addEventListener('touchstart', (e) => {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        e.preventDefault(); // Prevent scrolling
        mouseDown = true;
        
        if (e.touches.length > 0) {
            touchIdentifier = e.touches[0].identifier;
            handleTouch(e);
        }
    }, { passive: false });

    gameCanvas.addEventListener('touchmove', (e) => {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        e.preventDefault(); // Prevent scrolling
        
        if (mouseDown) {
            handleTouch(e);
        }
    }, { passive: false });

    gameCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        mouseDown = false;
        touchIdentifier = null;
    }, { passive: false });

    gameCanvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        mouseDown = false;
        touchIdentifier = null;
    }, { passive: false });
}

// Initialize
console.log('🎅 Santa Gifts Catch - Game Loaded!');
console.log('Use mouse/touch to move the bag or Arrow Keys/A/D');

// Setup controls immediately
setupControls();

// Show welcome screen on load
setTimeout(() => {
    showWelcomeScreen();
}, 100);