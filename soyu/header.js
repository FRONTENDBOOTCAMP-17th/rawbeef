function createHeader() {
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center px-8 py-4 bg-gray-100 dark:bg-gray-900 border-b border-black/10 dark:border-white/10 h-[57px]';
  const logo = document.createElement('span');
  logo.className = 'text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent';
  logo.textContent = 'TJ';

  const themeToggle = document.createElement('button');
  themeToggle.id = 'themeToggle';
  themeToggle.className = 'text-sm text-gray-500 dark:text-gray-400 border border-black/10 dark:border-white/10 px-4 py-1.5 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer';

  const themeIcon = document.createElement('span');
  themeIcon.id = 'themeIcon';
  themeIcon.textContent = '🌙';

  const themeLabel = document.createElement('span');
  themeLabel.id = 'themeLabel';
  themeLabel.textContent = '다크모드';

  themeToggle.append(themeIcon, themeLabel);
  header.append(logo, themeToggle);

  return header;
}

function initTheme() {
  const html = document.documentElement;
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function applyTheme(dark) {
    if (dark) {
      html.classList.add('dark');
      themeIcon.textContent = '☀️';
      themeLabel.textContent = '라이트모드';
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      themeIcon.textContent = '🌙';
      themeLabel.textContent = '다크모드';
      localStorage.setItem('theme', 'light');
    }
  }

  applyTheme(localStorage.getItem('theme') !== 'light');

  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(!html.classList.contains('dark'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('header-container');
  if (container) {
    container.replaceWith(createHeader());
    initTheme();
  }
});
