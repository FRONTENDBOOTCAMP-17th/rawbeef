const menuItems = [
  { href: './admin_open.html', label: '관리자메뉴' },
  { href: './admin_category.html', label: '카테고리관리' },
  { href: './admin_song.html', label: '노래 관리' },
  { href: './admin_request.html', label: '노래 신청 관리' },
];

function createSidebar() {
  const currentPage = './' + location.pathname.split('/').pop();

  const aside = document.createElement('aside');
  aside.className = 'w-1/5 bg-white dark:bg-gray-900 border-r border-black/10 dark:border-white/10 flex flex-col p-6 gap-6 h-[calc(100vh-57px)]';

  menuItems.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    link.className = 'block w-full';

    const isActive = currentPage === item.href;
    link.className = `block w-full py-4 border border-black/10 dark:border-white/10 font-bold text-center text-gray-900 dark:text-white rounded-lg
  ${isActive ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400' : 'hover:bg-black/5 dark:hover:bg-white/5'}`;

    link.textContent = item.label;
    aside.appendChild(link);
  });
  const token = localStorage.getItem('adminToken');
  if (token) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'block w-full py-4 border border-red-500/50 font-bold text-center text-red-500 dark:text-red-400 hover:bg-red-500/20 transition mt-auto rounded-lg';
    logoutBtn.textContent = '로그아웃';
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminToken');
      location.href = './admin_open.html';
    });
    aside.appendChild(logoutBtn);
  }

  return aside;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('sidebar-container');
  if (container) {
    container.replaceWith(createSidebar());
  }
});
