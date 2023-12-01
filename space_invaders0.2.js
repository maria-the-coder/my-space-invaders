// Get the canvas and context
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var shootSound = new Audio('shoot.mp3');
var explosionSound = new Audio('explosion.mp3');
var gameOverSoundWin = new Audio('win.mp3');
var gameOverSoundLose = new Audio('lose.mp3');
 

// Game variables
var player = { x: canvas.width / 2, y: canvas.height - 60, width: 50, height: 50 };
var bullets = [];
var enemies = [];
var enemySpeed = 1;
var gameOver = false;

// Initialize enemies
function initEnemies() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            enemies.push({ x: 50 + j * 60, y: 30 + i * 60, width: 40, height: 40 });
        }
    }
}
initEnemies();

let lastBulletTime = 0;
const bulletDelay = 100; // delay in milliseconds

// Update game state
function update() {
    // Move player
    if (isGoLeft && player.x >0){ player.x -= 10; }
    if (isGoRight && player.x <canvas.width - player.width) { player.x += 10; }

    // Move bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 2;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // create bullets
    if (isShooting) {
        let currentTime = Date.now();
        if (currentTime - lastBulletTime > bulletDelay) {
            bullets.push({ x: player.x + 20, y: player.y, width: 10, height: 15 });
            shootSound.play(); // Play shooting sound
            lastBulletTime = currentTime;
        }
    }

    // Move enemies
    for (let enemy of enemies) {
        enemy.x += enemySpeed;
        if (enemy.x > canvas.width - enemy.width || enemy.x < 0) {
            enemySpeed *= -1;
            for (let e of enemies) {
                e.y += 20;
            }
            break;
        }
    }

    // Check for game over
    for (let enemy of enemies) {
        if (enemy.y + enemy.height > player.y) {
            gameOver = true;
            break;
        }
    }
    if (enemies.length == 0) gameOver = true;

    // Collision detection
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            let b = bullets[i];
            let e = enemies[j];
            if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
		explosionSound.play(); // Play explosion sound
                break;
            }
        }
    }
}

// Draw player as a spaceship
function drawPlayer() {
    // if player is turning left or right, make the spaceship tilt
    if (isGoLeft) {
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(-Math.PI / 20);
        ctx.drawImage(playerImage, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    } else if (isGoRight) {
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.rotate(Math.PI / 20);
        ctx.drawImage(playerImage, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    } else {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }
    //ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    // ctx.beginPath();
    // ctx.moveTo(player.x + player.width / 2, player.y); // Nose of the spaceship
    // ctx.lineTo(player.x, player.y + player.height); // Left wing
    // ctx.lineTo(player.x + player.width, player.y + player.height); // Right wing
    // ctx.closePath();
    // ctx.fillStyle = 'blue';
    // ctx.fill();
}

// Draw enemy as a spaceship
function drawEnemy(enemy) {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    //

    // ctx.beginPath();
    // ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height); // Tail of the spaceship
    // ctx.lineTo(enemy.x, enemy.y); // Left wing
    // ctx.lineTo(enemy.x + enemy.width, enemy.y); // Right wing
    // ctx.closePath();
    // ctx.fillStyle = 'green';
    // ctx.fill();
}

// Create a new image object
var gameOverImage = new Image();
// Set the source to the path of your downloaded image
gameOverImage.src = 'win.png';

// Create a new image object
var loseImage = new Image();
// Set the source to the path of your downloaded image
loseImage.src = 'lose.png';

// load image called background.jpg
var backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

// load image called playership_sm.png
var playerImage = new Image();
playerImage.src = 'playership_sm.png';

// load image called bulletsm.png
var bulletImage = new Image();
bulletImage.src = 'bulletsm.png';

// load image called enemy.png
var enemyImage = new Image();
enemyImage.src = 'enemy.png';
// Updated draw function
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw player spaceship
    drawPlayer();

    // Draw bullets
    ctx.fillStyle = 'red';
    for (let bullet of bullets) {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        
       // ctx.fillRect(bullet.x, bullet.y, 10, 20);
    }

    // Draw enemy spaceships
    for (let enemy of enemies) {
        drawEnemy(enemy);
    }



    // Game over text
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        if (enemies.length == 0) {        
			ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
            gameOverSoundWin.play(); 
        } else {
			ctx.drawImage(loseImage, 0, 0, canvas.width, canvas.height);
            gameOverSoundLose.play(); 
        }
    }
}


// Event listeners for moving the player
let isShooting = false;
let isGoLeft = false;
let isGoRight = false;

// Event listeners for moving the player on keyboard, key down
window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
	    isGoLeft = true;
            break;
        case 'ArrowRight':
	    isGoRight = true;
            break;
        case ' ':
            isShooting = true;
            break;
    }
});
// Event listeners for moving the player on keyboard, key up
window.addEventListener('keyup', event => {
    switch (event.key) {
        case 'ArrowLeft':
	    isGoLeft = false;
            break;
        case 'ArrowRight':
	    isGoRight = false;
            break;
        case ' ':
            isShooting = false;
            break;
    }
});
// controls for mobile
// if swipe right move right
// if swipe left move left
// if tap shoot

// Event listeners for moving the player on mobile, touch start
window.addEventListener('touchstart', event => {
    if (event.touches[0].clientX < canvas.width / 2) {
        isGoLeft = true;
    } else {
        isGoRight = true;
    }
    isShooting = true;
});
// Event listeners for moving the player on mobile, touch end
window.addEventListener('touchend', event => {
    isGoLeft = false;
    isGoRight = false;
    isShooting = false;
});




// Main game loop
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
