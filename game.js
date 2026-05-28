const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =========================
// 🎮 AUDIO SYSTEM
// =========================
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

// =========================
// 🎮 GAME OBJECTS
// =========================
let player = {
  x: 0,
  y: 0,
  w: 10,
  h: 80,
  speed: 9
};

let bot = {
  x: 0,
  y: 0,
  w: 10,
  h: 80,
  speed: 8
};

let ball = {
  x: 0,
  y: 0,
  vx: 4,
  vy: 3,
  r: 10
};

// =========================
// 📏 RESIZE (FIXED FULLSCREEN + NO OFFSET)
// =========================
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  player.x = 0;
  player.y = canvas.height / 2 - player.h / 2;

  bot.x = canvas.width - bot.w;
  bot.y = canvas.height / 2 - bot.h / 2;

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}

window.addEventListener("resize", resize);

// =========================
// 🎮 INPUT
// =========================
let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// =========================
// 🟣 GRID
// =========================
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

// =========================
// 🎮 GAME LOGIC
// =========================
function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
}

function moveBot() {
  if (bot.y + bot.h / 2 < ball.y) bot.y += bot.speed;
  else bot.y -= bot.speed;

  bot.y = Math.max(0, Math.min(canvas.height - bot.h, bot.y));
}

function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // wall bounce
  if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
    ball.vy *= -1;
    playSound(300);
  }

  // player hit
  if (
    ball.x - ball.r <= player.x + player.w &&
    ball.y >= player.y &&
    ball.y <= player.y + player.h
  ) {
    ball.vx *= -1;
    playSound(700);
  }

  // bot hit
  if (
    ball.x + ball.r >= bot.x &&
    ball.y >= bot.y &&
    ball.y <= bot.y + bot.h
  ) {
    ball.vx *= -1;
    playSound(700);
  }

  // reset
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
}

// =========================
// 🎨 DRAW
// =========================
function draw() {
  ctx.fillStyle = "#050010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  ctx.fillStyle = "white";

  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillRect(bot.x, bot.y, bot.w, bot.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.setLineDash([5, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "gray";
  ctx.stroke();
}

// =========================
// 🔁 LOOP
// =========================
function update() {
  movePlayer();
  moveBot();
  moveBall();
  draw();

  requestAnimationFrame(update);
}

// =========================
// 🚀 START GAME
// =========================
window.addEventListener("load", () => {
  resize();
  update();
});
