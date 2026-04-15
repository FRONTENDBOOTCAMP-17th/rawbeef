(function () {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0;
  let H = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;

    cv.width = W * DPR;
    cv.height = H * DPR;
    cv.style.width = `${W}px`;
    cv.style.height = `${H}px`;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);
})();

// 5각 별
function drawStar5(x, y, r, alpha, hue) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.fillStyle = `hsla(${hue},55%,88%,1)`;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const oa = Math.PI / 2 + i * ((Math.PI * 2) / 5);
    const ia = oa + Math.PI / 5;
    if (i === 0) ctx.moveTo(Math.cos(oa) * r, -Math.sin(oa) * r);
    else ctx.lineTo(Math.cos(oa) * r, -Math.sin(oa) * r);
    ctx.lineTo(Math.cos(ia) * r * 0.42, -Math.sin(ia) * r * 0.42);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// 음표
function drawNote(x, y, size, alpha, hue) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.fillStyle = `hsla(${hue},50%,78%,1)`;
  ctx.strokeStyle = `hsla(${hue},50%,78%,1)`;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.74, size * 0.52, -0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = size * 0.17;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.62, 0);
  ctx.lineTo(size * 0.62, -size * 2.8);
  ctx.stroke();
  ctx.restore();
}

// 배경 고정 별 130개
const bgStars = Array.from({ length: 130 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 2 + 1.2,
  alpha: Math.random() * 0.2 + 0.06,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.009 + 0.004,
}));

// 움직이는 파티클 (별 70% + 음표 30%)
const particles = Array.from({ length: 75 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.22,
  vy: (Math.random() - 0.5) * 0.22,
  size: Math.random() * 6 + 5,
  alpha: Math.random() * 0.3 + 0.1,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.016 + 0.007,
  hue: 245 + Math.random() * 25,
  isNote: Math.random() < 0.3,
}));

// 유성
const meteors = [];
let lastSpawn = 0;
function spawnMeteor() {
  const angle = Math.PI / 5 + Math.random() * (Math.PI / 9);
  const speed = 1.3 + Math.random() * 1.1;
  meteors.push({
    x: Math.random() * W * 1.2 - W * 0.1,
    y: -20,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    len: 75 + Math.random() * 65,
    alpha: 1,
    hue: 248 + Math.random() * 18,
    width: 1 + Math.random() * 0.6,
    noteSize: 6 + Math.random() * 3,
  });
}

let frame = 0;
function draw() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  if (frame - lastSpawn > 60 + Math.random() * 40) {
    spawnMeteor();
    if (Math.random() < 0.6) spawnMeteor();
    lastSpawn = frame;
  }

  // 배경 별
  bgStars.forEach((s) => {
    const tw = s.alpha + Math.sin(frame * s.speed + s.phase) * 0.07;
    drawStar5(s.x, s.y, s.r, Math.max(0.03, tw), 250);
  });

  // 움직이는 파티클
  particles.forEach((p) => {
    p.x += p.vx + Math.sin(frame * p.speed + p.phase) * 0.18;
    p.y += p.vy + Math.cos(frame * p.speed * 1.3 + p.phase) * 0.14;
    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;
    const tw = p.alpha + Math.sin(frame * p.speed * 1.8 + p.phase) * 0.07;
    if (p.isNote) drawNote(p.x, p.y, p.size, Math.max(0.05, tw), p.hue);
    else drawStar5(p.x, p.y, p.size, Math.max(0.05, tw), p.hue);
  });

  // 유성
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.x += m.vx;
    m.y += m.vy;
    m.alpha -= 0.007;
    if (m.alpha <= 0 || m.y > H + 40 || m.x > W + 40) {
      meteors.splice(i, 1);
      continue;
    }
    const spd = Math.hypot(m.vx, m.vy);
    const tx = m.x - (m.vx / spd) * m.len;
    const ty = m.y - (m.vy / spd) * m.len;
    const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
    grad.addColorStop(0, `hsla(${m.hue},65%,85%,${m.alpha * 0.85})`);
    grad.addColorStop(0.35, `hsla(${m.hue},55%,70%,${m.alpha * 0.35})`);
    grad.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = grad;
    ctx.lineWidth = m.width;
    ctx.lineCap = 'round';
    ctx.stroke();
    drawNote(m.x, m.y, m.noteSize, m.alpha * 0.9, m.hue);
  }

  requestAnimationFrame(draw);
}
draw();
