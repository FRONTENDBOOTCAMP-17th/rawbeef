/* ── 다크/라이트 모드 토글 (공통) ── */
const html = document.documentElement;
const btn = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');
const label = document.getElementById('themeLabel');

function applyTheme(dark, save = false) {
  html.classList.toggle('dark', dark);

  if (icon) icon.textContent = dark ? '☀️' : '🌙';
  if (label) label.textContent = dark ? '라이트 모드' : '다크 모드';

  if (save) localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// localStorage 우선, 없으면 시스템 설정 따름
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved ? saved === 'dark' : prefersDark);

if (btn) {
  btn.addEventListener('click', () => applyTheme(!html.classList.contains('dark'), true));
}
