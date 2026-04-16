window.requireAuth = function requireAuth() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    location.href = './admin_open.html';
    return null;
  }
  return token;
};
