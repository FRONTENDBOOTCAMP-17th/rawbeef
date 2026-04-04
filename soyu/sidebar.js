const menuItems = [
  { href: './admin_open.html', label: '관리자메뉴' },
  { href: './admin_category.html', label: '카테고리관리' },
  { href: './admin_song.html', label: '노래 관리' },
  { href: './admin_request.html', label: '노래 신청 관리' },
];

function createSidebar() {
  const currentPage = './' + location.pathname.split('/').pop();

  const aside = document.createElement('aside');
  aside.className = 'w-1/5 bg-white border-r-4 border-black flex flex-col p-6 gap-6 h-full';

  menuItems.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    link.className = 'block w-full';

    const isActive = currentPage === item.href;
    link.className = `block w-full py-4 border-2 border-black font-bold text-center ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`;

    link.textContent = item.label;
    aside.appendChild(link);
  });
  const token = localStorage.getItem('adminToken');
  if (token) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'block w-full py-4 border-2 border-red-500 font-bold text-center text-red-500 hover:bg-red-500 hover:text-white transition mt-auto';
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
