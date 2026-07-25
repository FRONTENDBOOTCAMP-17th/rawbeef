window.token = requireAuth();
let requests = [];
function formatDateTime(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ` + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const requestList = document.getElementById('requestList');

async function loadRequests() {
  try {
    const res = await fetch(`${API_BASE}/requests`);

    if (!res.ok) {
      alert('신청 목록 불러오기에 실패했습니다.');
      return;
    }
    const json = await res.json();
    requests = json.data;
    renderRequests();
  } catch {
    alert('서버 연결에 실패했습니다.');
  }
}

const saveComment = async (id, content) => {
  try {
    const res = await fetch(`${API_BASE}/requests/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      alert('댓글 등록에 실패했습니다.');
      return;
    }
    const json = await res.json();
    return;
  } catch {
    alert('서버 연결에 실패했습니다.');
  }
};

const deleteComment = async (commentId) => {
  try {
    const res = await fetch(`${API_BASE}/requests/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert('댓글 삭제에 실패했습니다.');
      return false;
    }
    return true;
  } catch {
    alert('서버 연결에 실패했습니다.');
    return false;
  }
};
const renderRequests = () => {
  requestList.innerHTML = '';
  requests.forEach((req, index) => {
    const div = document.createElement('div');
    div.className = 'relative bg-white dark:bg-gray-900 mx-auto border-t border-b border-gray-900 dark:border-white p-4 sm:p-6 mb-4';

    const title = document.createElement('h2');
    title.className = 'text-xl font-bold mb-2 text-center text-gray-900 dark:text-white';
    title.textContent = `${index + 1}. ${req.title}`;

    const date = document.createElement('p');
    date.className = 'text-sm font-bold mb-2 text-center text-gray-900 dark:text-white';
    date.textContent = `신청 일시: ${formatDateTime(req.createdAt)}`;

    const content = document.createElement('p');
    content.className = 'mb-6 text-center font-medium py-4 text-gray-800 dark:text-white text-xl';
    content.textContent = req.content;

    const adminBox = document.createElement('div');
    adminBox.className = 'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4';

    const inputArea = document.createElement('div');
    inputArea.className = 'flex items-center gap-4 flex-1 w-full';

    const adminLabel = document.createElement('span');
    adminLabel.className = 'font-black text-lg shrink-0 text-gray-900 dark:text-white';
    adminLabel.textContent = '관리자 답변';

    const adminInput = document.createElement('input');
    adminInput.type = 'text';
    if (req.comment) {
      adminInput.value = req.comment.content;
      adminInput.disabled = true;
      adminInput.className = 'w-full border-2 rounded-xl p-2 outline-none font-bold bg-gray-200 dark:bg-gray-300 text-gray-500 dark:text-gray-400 cursor-not-allowed';
    } else {
      adminInput.placeholder = '답변 내용을 입력하세요';
      adminInput.className = 'w-full border-2 rounded-xl p-2 outline-none focus:bg-yellow-50 font-bold dark:bg-gray-300 dark:text-black dark:border-gray-500';
    }
    inputArea.append(adminLabel, adminInput);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'flex space-x-6 shrink-0 self-end sm:self-auto';

    if (!req.comment) {
      const registerBtn = document.createElement('button');
      registerBtn.className = 'hover:text-blue-600 dark:hover:text-blue-400 font-black text-lg hover:scale-125 dark:text-white';
      registerBtn.textContent = '등록';
      registerBtn.addEventListener('click', async () => {
        const message = adminInput.value;
        if (!message) {
          alert('내용이 입력되지 않았습니다!');
          return;
        }
        await saveComment(req.id, message);
        alert('등록이 완료되었습니다!');
        await loadRequests();
      });
      btnGroup.appendChild(registerBtn);
    }
    if (req.comment) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'hover:text-red-600 dark:hover:text-red-400 font-black text-lg hover:scale-125 dark:text-white';
      deleteBtn.textContent = '삭제';
      deleteBtn.addEventListener('click', async () => {
        if (confirm('이 댓글을 정말 삭제할까요?')) {
          await deleteComment(req.comment.id);
          alert('삭제가 완료되었습니다!');
          await loadRequests();
        }
      });
      btnGroup.appendChild(deleteBtn);
    }

    const requestDeleteBtn = document.createElement('button');
    requestDeleteBtn.className = 'hover:text-red-600 dark:hover:text-red-400 font-black text-xl absolute top-4 right-4 hover:scale-125 dark:text-white';
    requestDeleteBtn.textContent = 'x';

    adminBox.append(inputArea, btnGroup);

    div.append(title, date, content, adminBox, requestDeleteBtn);

    requestList.appendChild(div);

    requestDeleteBtn.addEventListener('click', async () => {
      if (confirm('이 신청을 정말 삭제할까요?')) {
        try {
          const res = await fetch(`${API_BASE}/requests/${req.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            alert('신청 삭제에 실패했습니다.');
            return;
          }
          alert('삭제가 완료되었습니다!');
          await loadRequests();
        } catch (error) {
          alert('서버 연결에 실패했습니다.');
        }
      }
    });
  });
};

loadRequests();
