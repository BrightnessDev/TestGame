const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 🎮 AUDIO SYSTEM (FIXED – no files needed)
let audioCtx;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

document.addEventListener("keydown", initAudio);
document.addEventListener("click", initAudio);

function playSound(freq) {
  initAudio();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.05
  );

  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

// 🟣 RETRO GRID BACKGROUND
function drawGrid() {
  ctx.strokeStyle = "rgba(180, 80, 255, 0.15)";
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Resize function (FIXED)
function resize() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;

  bot.x = canvas.width - bot.w;

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
  x: 0,
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

resize();

// Controls
let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Player movement
function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
}

// Bot AI
function moveBot() {
  if (bot.y + bot.h / 2 < ball.y) {
    bot.y += bot.speed;
  } else {
    bot.y -= bot.speed;
  }

  bot.y = Math.max(0, Math.min(canvas.height - bot.h, bot.y));
}

// Ball + collision
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // wall bounce
  if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
    ball.vy *= -1;
    playSound(300);
  }

  // player collision
  if (
    ball.x - ball.r <= player.x + player.w &&
    ball.y >= player.y &&
    ball.y <= player.y + player.h
  ) {
    ball.x = player.x + player.w + ball.r;
    ball.vx *= -1;
    playSound(700);
  }

  // bot collision
  if (
    ball.x + ball.r >= bot.x &&
    ball.y >= bot.y &&
    ball.y <= bot.y + bot.h
  ) {
    ball.x = bot.x - ball.r;
    ball.vx *= -1;
    playSound(700);
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

  // 🟣 background
  ctx.fillStyle = "#050010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  ctx.fillStyle = "white";

  // paddles
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillRect(bot.x, bot.y, bot.w, bot.h);

  // ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  // middle line
  ctx.setLineDash([5, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "gray";
  ctx.stroke();
}

// Loop
function update() {
  movePlayer();
  moveBot();
  moveBall();
  draw();

  requestAnimationFrame(update);
}

update();
