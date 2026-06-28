const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const stabilityEl = document.querySelector("#stability");
const phaseEl = document.querySelector("#phase");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const titleCard = document.querySelector(".title-card");
const gameOver = document.querySelector("#gameOver");
const finalScore = document.querySelector("#finalScore");

const keys = new Set();
const pointer = { active: false, x: 0, y: 0 };
const player = { x: 480, y: 320, r: 16, speed: 265 };
let shards = [];
let hazards = [];
let particles = [];
let score = 0;
let stability = 100;
let running = false;
let lastTime = 0;
let time = 0;
let phase = "Normal";

function resetGame() {
  player.x = canvas.clientWidth / 2;
  player.y = canvas.clientHeight / 2;
  shards = Array.from({ length: 9 }, spawnShard);
  hazards = Array.from({ length: 7 }, (_, index) => spawnHazard(index));
  particles = [];
  score = 0;
  stability = 100;
  time = 0;
  phase = "Normal";
  running = true;
  titleCard.hidden = true;
  gameOver.hidden = true;
  updateHud();
}

function spawnShard() {
  const width = canvas.clientWidth || 960;
  const height = canvas.clientHeight || 640;
  return {
    x: 60 + Math.random() * (width - 120),
    y: 60 + Math.random() * (height - 120),
    r: 7 + Math.random() * 7,
    spin: Math.random() * Math.PI * 2,
  };
}

function spawnHazard(index) {
  const angle = (index / 7) * Math.PI * 2;
  const width = canvas.clientWidth || 960;
  const height = canvas.clientHeight || 640;
  return {
    x: width / 2 + Math.cos(angle) * Math.min(250, width * 0.28),
    y: height / 2 + Math.sin(angle) * Math.min(170, height * 0.24),
    r: 18 + Math.random() * 12,
    orbit: 80 + Math.random() * 210,
    speed: 0.35 + Math.random() * 0.55,
    seed: Math.random() * Math.PI * 2,
  };
}

function updateHud() {
  scoreEl.textContent = score;
  stabilityEl.textContent = Math.max(0, Math.round(stability));
  phaseEl.textContent = phase;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * window.devicePixelRatio);
  canvas.height = Math.round(rect.height * window.devicePixelRatio);
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function drawBackground(width, height) {
  ctx.fillStyle = "#07050d";
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  for (let i = 0; i < 11; i += 1) {
    ctx.rotate((Math.PI * 2) / 11);
    ctx.strokeStyle = `rgba(99, 247, 255, ${0.04 + i * 0.004})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 110 + i * 36, 28 + i * 19, time * 0.09, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawShard(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.spin + time * 2);
  ctx.fillStyle = "#b7ff4f";
  ctx.shadowColor = "#b7ff4f";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    const radius = i % 2 === 0 ? item.r * 1.7 : item.r * 0.62;
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHazard(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(time * 1.4 + item.seed);
  ctx.strokeStyle = "#ff5478";
  ctx.fillStyle = "rgba(255, 84, 120, 0.14)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#ff5478";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  for (let i = 0; i < 9; i += 1) {
    const a = (i / 9) * Math.PI * 2;
    const pulse = 0.72 + Math.sin(time * 4 + item.seed + i) * 0.18;
    const radius = item.r * (i % 3 === 0 ? 1.5 : pulse);
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  const mirrorGlow = phase === "Mirror" ? "#a47cff" : "#63f7ff";
  ctx.shadowColor = mirrorGlow;
  ctx.shadowBlur = 24;
  ctx.fillStyle = mirrorGlow;
  ctx.beginPath();
  ctx.arc(0, 0, player.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#050408";
  ctx.beginPath();
  ctx.arc(5, -4, player.r * 0.34, 0, Math.PI * 2);
  ctx.arc(-5, 5, player.r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function emit(x, y, color, amount = 12) {
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 120;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.7 + Math.random() * 0.45,
      color,
    });
  }
}

function update(dt) {
  time += dt;
  phase = Math.floor(time / 13) % 2 === 1 ? "Mirror" : "Normal";
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const invert = phase === "Mirror" ? -1 : 1;
  let dx = 0;
  let dy = 0;

  if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) dy += 1;

  if (pointer.active) {
    dx += Math.sign(pointer.x - player.x) * 0.85;
    dy += Math.sign(pointer.y - player.y) * 0.85;
  }

  const length = Math.hypot(dx, dy) || 1;
  player.x += (dx / length) * player.speed * dt * invert;
  player.y += (dy / length) * player.speed * dt * invert;
  player.x = Math.max(player.r, Math.min(width - player.r, player.x));
  player.y = Math.max(player.r, Math.min(height - player.r, player.y));

  for (const item of hazards) {
    item.x += Math.cos(time * item.speed + item.seed) * 38 * dt;
    item.y += Math.sin(time * item.speed * 1.3 + item.seed) * 32 * dt;
    item.x += (width / 2 - item.x) * 0.025 * dt;
    item.y += (height / 2 - item.y) * 0.025 * dt;
  }

  shards = shards.filter((item) => {
    if (Math.hypot(player.x - item.x, player.y - item.y) < player.r + item.r + 5) {
      score += phase === "Mirror" ? 17 : 11;
      stability = Math.min(100, stability + 5);
      emit(item.x, item.y, "#b7ff4f", 18);
      shards.push(spawnShard());
      return false;
    }
    return true;
  });

  for (const item of hazards) {
    if (Math.hypot(player.x - item.x, player.y - item.y) < player.r + item.r * 0.72) {
      stability -= 28 * dt;
      emit(player.x, player.y, "#ff5478", 3);
    }
  }

  stability -= dt * (phase === "Mirror" ? 2.1 : 0.9);
  particles = particles
    .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, life: p.life - dt }))
    .filter((p) => p.life > 0);

  if (stability <= 0) {
    running = false;
    gameOver.hidden = false;
    finalScore.textContent = `分数 ${score}`;
  }
  updateHud();
}

function render() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  drawBackground(width, height);
  for (const item of shards) drawShard(item);
  for (const item of hazards) drawHazard(item);
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  drawPlayer();
}

function loop(now) {
  const dt = Math.min(0.032, (now - lastTime) / 1000 || 0);
  lastTime = now;
  if (running) update(dt);
  render();
  requestAnimationFrame(loop);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
    event.preventDefault();
  }
  keys.add(event.key);
});
window.addEventListener("keyup", (event) => keys.delete(event.key));
window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  Object.assign(pointer, canvasPoint(event));
});
canvas.addEventListener("pointermove", (event) => {
  if (pointer.active) Object.assign(pointer, canvasPoint(event));
});
canvas.addEventListener("pointerup", () => {
  pointer.active = false;
});
startButton.addEventListener("click", resetGame);
restartButton.addEventListener("click", resetGame);

resizeCanvas();
resetGame();
running = false;
titleCard.hidden = false;
requestAnimationFrame(loop);
