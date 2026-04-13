const jalnanStyle = document.createElement('style');
jalnanStyle.textContent = `
  @font-face {
    font-family: 'Jalnan2';
    src: url('/font/Jalnan2/Jalnan2TTF.ttf') format('truetype'),
         url('/font/Jalnan2/Jalnan2.otf') format('opentype');
  }
`;
document.head.appendChild(jalnanStyle);

function createHeader() {
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-50 w-full h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm transition-colors duration-200';

  const logo = document.createElement('a');
  logo.href = './SWcantabile_song.html';
  logo.className = 'no-underline';

  const logoText = document.createElement('span');
  logoText.className = 'text-xl bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent';
  logoText.style.fontFamily = "'Jalnan2', sans-serif";
  logoText.textContent = 'SW';

  const logoSpan = document.createElement('span');
  logoSpan.className = 'text-lg text-orange-600';
  logoSpan.style.fontFamily = "'Jalnan2', sans-serif";
  logoSpan.textContent = '칸타빌레';

  logo.append(logoText, logoSpan);

  const themeToggle = document.createElement('button');
  themeToggle.id = 'themeToggle';
  themeToggle.title = '테마 전환';
  themeToggle.className =
    'flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap';

  const themeIcon = document.createElement('span');
  themeIcon.id = 'themeIcon';
  themeIcon.textContent = '🌙';

  const themeLabel = document.createElement('span');
  themeLabel.id = 'themeLabel';
  themeLabel.textContent = '다크 모드';

  themeToggle.append(themeIcon, themeLabel);
  header.append(logo, themeToggle);

  return header;
}

const container = document.getElementById('user-header');
if (container) {
  container.replaceWith(createHeader());
}
