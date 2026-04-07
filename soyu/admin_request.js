const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}
let requests = [];

const requestList = document.getElementById('requestList');

async function loadRequests() {
  try {
    const res = await fetch(`${API_BASE}/requests`);
    const json = await res.json();
    if (!res.ok) {
      alert('신청 목록 불러오기에 실패했습니다.');
      return;
    }
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
    const json = await res.json();

    if (!res.ok) {
      alert('댓글 등록에 실패했습니다.');
      return;
    }
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
    div.className = 'relative border-4 border-black p-6 mb-8 bg-white';

    const title = document.createElement('h2');
    title.className = 'text-xl font-bold mb-2 text-center';
    title.textContent = `${index + 1}. ${req.title}`;

    const date = document.createElement('p');
    date.className = 'text-sm text-gray-600 text-center';
    date.textContent = `신청 날짜: ${req.createdAt}`;

    const content = document.createElement('p');
    content.className = 'mb-6 text-center font-medium py-4';
    content.textContent = req.content;

    const adminBox = document.createElement('div');
    adminBox.className = 'flex justify-between items-center gap-4';

    const inputArea = document.createElement('div');
    inputArea.className = 'flex items-center gap-4 flex-1 w-full';

    const adminLabel = document.createElement('span');
    adminLabel.className = 'font-black text-lg shrink-0';
    adminLabel.textContent = '관리자 답변';

    const adminInput = document.createElement('input');
    adminInput.type = 'text';
    if (req.comment) {
      adminInput.value = req.comment.content;
      adminInput.disabled = true;
      adminInput.className = 'w-full border-2 border-black p-2 outline-none font-bold bg-gray-200 text-gray-500 cursor-not-allowed';
    } else {
      adminInput.placeholder = '답변 내용을 입력하세요';
      adminInput.className = 'w-full border-2 border-black p-2 outline-none focus:bg-yellow-50 font-bold';
    }
    inputArea.append(adminLabel, adminInput);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'flex space-x-6 shrink-0';

    const registerBtn = document.createElement('button');
    registerBtn.className = 'hover:text-blue-600 font-black text-lg hover:scale-125';
    registerBtn.textContent = '등록';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'hover:text-red-600 font-black text-lg hover:scale-125';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', async () => {
      if (confirm('이 댓글을 정말 삭제할까요?')) {
        await deleteComment(req.comment.id);
        alert('삭제가 완료되었습니다!');
        await loadRequests();
      }
    });

    const requestDeleteBtn = document.createElement('button');
    requestDeleteBtn.className = 'hover:text-red-600 font-black text-xl absolute top-4 right-4 hover:scale-125 ';
    requestDeleteBtn.textContent = '✘';

    btnGroup.append(registerBtn, deleteBtn);

    adminBox.append(inputArea, btnGroup);

    div.append(title, date, content, adminBox, requestDeleteBtn);

    requestList.appendChild(div);

    registerBtn.addEventListener('click', async () => {
      const message = adminInput.value;

      if (!message) {
        alert('내용이 입력되지 않았습니다!');
        return;
      }
      console.log('req.comment:', req.comment);
      if (req.comment) {
        alert('이미 답변이 등록된 신청입니다!');
        return;
      }

      await saveComment(req.id, message);
      alert('등록이 완료되었습니다!');

      await loadRequests();
    });
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
          console.log(error);
          alert('서버 연결에 실패했습니다.');
        }
      }
    });
  });
};

loadRequests();
