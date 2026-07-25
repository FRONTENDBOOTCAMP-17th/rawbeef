const menuItems = [{ label: '관리자 페이지' }, { href: '/admin/category', label: '카테고리관리' }, { href: '/admin/song', label: '노래 관리' }, { href: '/admin/request', label: '노래 신청 관리' }];

function createSidebar() {
  const currentPage = location.pathname;

  const aside = document.createElement('aside');
  aside.className =
    'w-full md:w-1/5 bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 flex flex-row md:flex-col p-3 md:p-6 gap-2 md:gap-6 h-auto md:h-[calc(100vh-57px)] overflow-x-auto';

  menuItems.forEach((item) => {
    if (!item.href) {
      const span = document.createElement('span');
      span.textContent = item.label;
      span.className = 'shrink-0 whitespace-nowrap md:w-full py-2 px-4 md:py-4 md:px-0 font-bold text-center rounded-lg text-gray-900 dark:text-white';
      aside.appendChild(span);
      return;
    }
    const link = document.createElement('a');
    link.href = item.href;

    const isActive = currentPage === item.href;
    link.className = `shrink-0 whitespace-nowrap md:w-full py-2 px-4 md:py-4 md:px-0 border border-black/10 dark:border-white/10 font-bold text-center text-gray-900 dark:text-white rounded-lg
  ${isActive ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400' : 'hover:bg-black/5 dark:hover:bg-white/5'}`;

    link.textContent = item.label;
    aside.appendChild(link);
  });
  const token = localStorage.getItem('adminToken');
  if (token) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className =
      'shrink-0 whitespace-nowrap md:w-full py-2 px-4 md:py-4 md:px-0 border border-red-500/50 font-bold text-center text-red-500 dark:text-red-400 hover:bg-red-500/20 transition md:mt-auto rounded-lg';
    logoutBtn.textContent = '로그아웃';
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminToken');
      location.href = '/admin';
    });
    aside.appendChild(logoutBtn);
  }

  return aside;
}

const sideContainer = document.getElementById('sidebar-container');
if (sideContainer) {
  sideContainer.replaceWith(createSidebar());
}
