document.getElementById('user-header').innerHTML = `
  <header class="sticky top-0 z-50 w-full h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm transition-colors duration-200">
    <a href="./user_song.html" class="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 no-underline">TJ<span class="text-red-600">미디어</span></a>
    <button
      id="themeToggle"
      title="테마 전환"
      class="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
    >
      <span id="themeIcon">🌙</span>
      <span id="themeLabel">다크 모드</span>
    </button>
  </header>
`;
