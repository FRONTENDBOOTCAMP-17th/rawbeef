/* ── 다크/라이트 모드 토글 (공통) ── */
const html = document.documentElement;
const btn = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');
const label = document.getElementById('themeLabel');

function applyTheme(dark) {
  if (dark) {
    html.classList.add('dark');
    icon.textContent = '☀️';
    label.textContent = '라이트 모드';
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    icon.textContent = '🌙';
    label.textContent = '다크 모드';
    localStorage.setItem('theme', 'light');
  }
}

applyTheme(localStorage.getItem('theme') === 'dark');
btn.addEventListener('click', () => applyTheme(!html.classList.contains('dark')));
