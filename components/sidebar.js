const menuItems = [
  { title: '대시보드', href: '/pages/dashboard.html' },
  { title: '카테고리 관리', href: '/pages/category.html' },
  { title: '노래 관리', href: '/pages/song.html' },
  { title: '노래 신청 관리', href: '/pages/request.html' }, // 추가
];
export function createSidebar() {
  const currentPath = window.location.pathname;

  const aside = document.createElement('aside');
  aside.className = 'w-64 bg-white border-r p-6 flex-shrink-0';

  const title = document.createElement('h2');
  title.className = 'text-xl font-bold mb-6';
  title.textContent = '관리자';
  aside.appendChild(title);

  const nav = document.createElement('nav');
  nav.className = 'flex flex-col gap-2';

  menuItems.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.title;

    const isActive = currentPath === item.href;
    if (isActive) {
      a.className = 'block py-2 px-4 bg-blue-100 text-blue-700 rounded font-medium';
    } else {
      a.className = 'block py-2 px-4 hover:bg-gray-100 rounded';
    }

    nav.appendChild(a);
  });

  aside.appendChild(nav);
  return aside;
}
