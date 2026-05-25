const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

// Paddle Player Left
let player = {
  x: 20,
  y: 200,
  w: 10,
  h: 80,
  speed: 6
};

// Paddle Bot Right
let bot = {
  x: 770,
  y: 200,
  w: 10,
  h: 80,
  speed: 4
};

// Ball
let ball = {
  x: 400,
  y: 250,
  vx: 4,
  vy: 3,
  r: 8
};

// Controls
let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Player move
function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
}

// AI Bot
function moveBot() {
  if (bot.y + bot.h / 2 < ball.y) {
    bot.y += bot.speed;
  } else {
    bot.y -= bot.speed;
  }
}

// Ball Movement and collison
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // top/bottom bounce
  if (ball.y <= 0 || ball.y >= canvas.height) {
    ball.vy *= -1;
  }

  // player paddle collision
  if (
    ball.x - ball.r < player.x + player.w &&
    ball.y > player.y &&
    ball.y < player.y + player.h
  ) {
    ball.vx *= -1;
  }

  // bot paddle collision
  if (
    ball.x + ball.r > bot.x &&
    ball.y > bot.y &&
    ball.y < bot.y + bot.h
  ) {
    ball.vx *= -1;
  }

  // reset if out of bounds
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = 400;
    ball.y = 250;
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // paddles
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillRect(bot.x, bot.y, bot.w, bot.h);

  // ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  // center line
  ctx.setLineDash([5, 10]);
  ctx.beginPath();
  ctx.moveTo(400, 0);
  ctx.lineTo(400, 500);
  ctx.strokeStyle = "gray";
  ctx.stroke();
}

// Game loop
function update() {
  movePlayer();
  moveBot();
  moveBall();
  draw();

  requestAnimationFrame(update);
}

update();
