// Contenuti fittizi per i tab del diario
const diaryData = {
    lucy: {
        left: `
            <h3>Lucy's Stuff</h3>
            <p>Welcome to my personal section! Here are some polaroids of my setup.</p>
            <div class="polaroid">
                <div style="width: 100%; height: 120px; background: #333; color: white; display:flex; align-items:center; justify-content:center;">IMG: Cyberdeck Setup</div>
                <p style="text-align:center; margin: 5px 0 0 0;">My DIY Build</p>
            </div>
        `,
        right: `
            <p>Building this Bratz cyberdeck was an amazing experience. It's essentially a Raspberry Pi disguised as a 2000s toy.</p>
            <ul>
                <li>Component 1: Screen</li>
                <li>Component 2: Mechanical Keyboard</li>
                <li>Component 3: Bratz Box</li>
            </ul>
        `
    },
    diary: {
        left: `
            <h3>Dev Diary</h3>
            <p>Day 1: Started cutting the plastic box...</p>
            <p>Day 2: Wiring the LCD screen. Broke a connector :'(</p>
            <p>Day 3: It's ALIVE!!</p>
        `,
        right: `
            <p>Some more notes about the process.</p>
            <div class="polaroid">
                <div style="width: 100%; height: 120px; background: #555; color: white; display:flex; align-items:center; justify-content:center;">IMG: Wiring</div>
                <p style="text-align:center; margin: 5px 0 0 0;">Messy cables</p>
            </div>
        `
    },
    tips: {
        left: `
            <h3>Y2K Web Tips</h3>
            <p>Want to build a site like this?</p>
            <ul>
                <li>Use lots of pink</li>
                <li>Add pixel fonts (like VT323)</li>
                <li>MS Paint UI elements</li>
                <li>Glitter backgrounds!</li>
            </ul>
        `,
        right: `
            <p>Don't forget to break some layout rules intentionally for that raw, authentic feel!</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestione Tabs del Diario
    const markers = document.querySelectorAll('.marker');
    const leftContent = document.getElementById('diary-left-content');
    const rightContent = document.getElementById('diary-right-content');

    // Funzione per aggiornare il contenuto
    function updateDiary(tabId) {
        if (diaryData[tabId]) {
            leftContent.innerHTML = diaryData[tabId].left;
            rightContent.innerHTML = diaryData[tabId].right;
        }
    }

    // Inizializza con il primo tab
    updateDiary('lucy');

    markers.forEach(marker => {
        marker.addEventListener('click', (e) => {
            // Rimuovi classe active da tutti
            markers.forEach(m => m.classList.remove('active'));
            // Aggiungi classe active al cliccato
            e.target.classList.add('active');

            // Aggiorna contenuto
            const tabId = e.target.getAttribute('data-tab');
            updateDiary(tabId);
        });
    });

    // 2. Gestione form Guestbook
    const guestbookForm = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('guestbook-entries');

    guestbookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('gb-name');
        const countryInput = document.getElementById('gb-country');
        const messageInput = document.getElementById('gb-message');

        const name = nameInput.value.trim();
        const country = countryInput.value.trim();
        const message = messageInput.value.trim();

        if (name && message) {
            // Crea un nuovo elemento lista
            const li = document.createElement('li');
            li.className = 'gb-entry';

            // Formatta la data
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            li.innerHTML = `<strong>${name}</strong> <em>(${country || 'Unknown'})</em> at ${timeString}: <br> ${message}`;

            // Aggiungi in cima alla lista
            entriesContainer.prepend(li);

            // Pulisci i campi (lasciamo magari il nome se vuole riscrivere, ma per ora puliamo tutto o solo il msg)
            messageInput.value = '';

            // Auto-scroll in cima se serve, ma con prepend è già visibile
        }
    });
});

// --- Dino Game Logic ---
(function () {
    const canvas = document.getElementById('dinoCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('dino-game-container');
    const startText = document.getElementById('dino-start-text');

    const dinoImg = new Image();
    dinoImg.src = 'img/dino.png';
    const cactusImg = new Image();
    cactusImg.src = 'img/cactus.png';

    let gameLoop;
    let isPlaying = false;
    let score = 0;
    let frameCount = 0;

    const dino = {
        x: 30,
        y: 110,
        width: 20,
        height: 24,
        dy: 0,
        gravity: 0.6,
        jumpPower: -10,
        isJumping: false,
        draw: function () {
            ctx.drawImage(dinoImg, this.x, this.y, this.width, this.height);
        },
        update: function () {
            this.dy += this.gravity;
            this.y += this.dy;

            if (this.y > 110) {
                this.y = 110;
                this.dy = 0;
                this.isJumping = false;
            }
        },
        jump: function () {
            if (!this.isJumping) {
                this.dy = this.jumpPower;
                this.isJumping = true;
            }
        }
    };

    let obstacles = [];
    const obstacleSpeed = 4;

    function drawGround() {
        ctx.strokeStyle = '#535353';
        ctx.beginPath();
        ctx.moveTo(0, 134);
        ctx.lineTo(400, 134);
        ctx.stroke();
    }

    function spawnObstacle() {
        obstacles.push({
            x: 400,
            y: 114,
            width: 15,
            height: 20
        });
    }

    function updateObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            let obs = obstacles[i];
            obs.x -= obstacleSpeed;
            ctx.drawImage(cactusImg, obs.x, obs.y, obs.width, obs.height);

            // Collision detection
            if (dino.x < obs.x + obs.width &&
                dino.x + dino.width > obs.x &&
                dino.y < obs.y + obs.height &&
                dino.y + dino.height > obs.y) {
                gameOver();
            }
        }

        // Remove off-screen obstacles
        obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    }

    function drawScore() {
        ctx.fillStyle = '#535353';
        ctx.font = '12px var(--font-pixel, monospace)';
        ctx.fillText('SCORE: ' + Math.floor(score), 320, 20);
    }

    function gameUpdate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawGround();
        dino.update();
        dino.draw();

        if (frameCount % 90 === 0) {
            spawnObstacle();
        }
        updateObstacles();

        score += 0.1;
        drawScore();

        frameCount++;
        if (isPlaying) {
            gameLoop = requestAnimationFrame(gameUpdate);
        }
    }

    function startGame() {
        if (isPlaying) return;
        isPlaying = true;
        score = 0;
        frameCount = 0;
        obstacles = [];
        dino.y = 110;
        dino.dy = 0;
        startText.style.display = 'none';
        gameUpdate();
    }

    function gameOver() {
        isPlaying = false;
        cancelAnimationFrame(gameLoop);
        startText.innerText = 'Game Over! Click to Restart';
        startText.style.display = 'block';
    }

    function handleInput(e) {
        if (e.type === 'keydown' && e.code !== 'Space') return;
        if (e.type === 'keydown') e.preventDefault(); // Prevent scrolling

        if (!isPlaying) {
            startGame();
        } else {
            dino.jump();
        }
    }

    container.addEventListener('mousedown', handleInput);
    container.addEventListener('keydown', handleInput);
})();


// --- Music Player Logic ---
(function () {
    const playBtn = document.getElementById('play-music-btn');
    const audio = document.getElementById('bg-music');
    const cdDisc = document.getElementById('cd-disc');

    if (playBtn && audio && cdDisc) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                cdDisc.classList.add('playing');
                playBtn.innerText = 'pause';
            } else {
                audio.pause();
                cdDisc.classList.remove('playing');
                playBtn.innerText = 'here';
            }
        });
    }
})();

