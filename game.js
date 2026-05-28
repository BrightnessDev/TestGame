const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const hitSound = new Audio("hit.wav");
const wallSound = new Audio("wall.wav");

// Resize function (FIXED)
function resize() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;

  // keep bot glued to right edge
  bot.x = canvas.width - bot.w;

  // optional: keep player in bounds
  if (player.y > canvas.height - player.h) {
    player.y = canvas.height - player.h;
  }
}

window.addEventListener("resize", resize);

// Paddles
let player = {
  x: 0,
  y: 200,
  w: 10,
  h: 80,
  speed: 9
};

let bot = {
  x: 0, // will be set in resize()
  y: 200,
  w: 10,
  h: 80,
  speed: 9
};

// Ball
let ball = {
  x: 400,
  y: 250,
  vx: 4,
  vy: 3,
  r: 10
};

// run resize once AFTER objects exist
resize();

// Controls
let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Player movement
function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  // clamp inside screen
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
}

// Bot AI
function moveBot() {
  if (bot.y + bot.h / 2 < ball.y) {
    bot.y += bot.speed;
  } else {
    bot.y -= bot.speed;
  }

  // clamp
  bot.y = Math.max(0, Math.min(canvas.height - bot.h, bot.y));
}

// Ball + collision (FIXED)
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // top/bottom bounce
  if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
    ball.vy *= -1;
  }

  // player collision (prevents sticking)
  if (
    ball.x - ball.r <= player.x + player.w &&
    ball.y >= player.y &&
    ball.y <= player.y + player.h
  ) {
    ball.x = player.x + player.w + ball.r;
    ball.vx *= -1;
  }

  // bot collision (prevents sticking)
  if (
    ball.x + ball.r >= bot.x &&
    ball.y >= bot.y &&
    ball.y <= bot.y + bot.h
  ) {
    ball.x = bot.x - ball.r;
    ball.vx *= -1;
  }

  // reset
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
}

// Draw
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

  // center line (dynamic FIX)
  ctx.setLineDash([5, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
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
