const API_BASE = 'https://api.fullstackfamily.com/api/rawbeef/v1/requests';
const LIMIT = 30;
let currentPage = 1;
let totalPages = 1;

/* ── 날짜 포맷 ── */
function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

/* ── 목록 렌더 ── */
function renderList(data) {
  const list = document.getElementById('requestList');
  list.innerHTML = '';

  if (!data.length) {
    list.innerHTML = '<p class="text-center py-12 text-gray-400 text-sm">등록된 신청이 없습니다.</p>';
    return;
  }

  data.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'accordion-item border-b border-gray-100 dark:border-gray-700';
    el.innerHTML = `
      <!-- 아코디언 헤더 -->
      <button
        class="accordion-trigger w-full grid text-left px-3 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-100 cursor-pointer bg-transparent border-none font-[inherit]"
        style="grid-template-columns: 60px 1fr 80px;"
      >
        <span class="text-xs text-gray-400 text-center self-center">${item.id}</span>
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100 self-center flex items-center gap-2">
          ${item.title}
          ${item.comments && item.comments.length ? `<span class="text-xs text-red-500 font-semibold">[${item.comments.length}]</span>` : ''}
        </span>
        <span class="text-xs text-gray-400 text-center self-center flex items-center justify-center gap-1">
          ${formatDate(item.createdAt)}
          <svg class="accordion-arrow w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </button>
 
      <!-- 아코디언 바디 -->
      <div class="accordion-body bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 px-5 py-5">
        <!-- 본문 -->
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-5">${item.content}</p>
 
        <!-- 댓글(답변) -->
        ${
          item.comments && item.comments.length
            ? `
          <div class="mb-5">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">답변</p>
            ${item.comments
              .map(
                (c) => `
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-3 mb-2">
                <p class="text-sm text-gray-700 dark:text-gray-300 m-0 whitespace-pre-wrap">${c.content}</p>
                <p class="text-xs text-gray-400 mt-1 mb-0">${formatDate(c.createdAt)}</p>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }
 
        <!-- 삭제 -->
        <div class="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <input
            type="password"
            class="delete-pw h-9 px-3 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-red-600 dark:focus:border-red-400 placeholder:text-gray-400 transition-colors duration-150 w-40"
            placeholder="비밀번호 입력"
            maxlength="10"
          />
          <button
            class="delete-btn h-9 px-4 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-gray-800 text-red-600 text-sm font-semibold rounded border border-red-300 dark:border-red-700 cursor-pointer transition-colors duration-150 font-[inherit]"
            data-id="${item.id}"
          >삭제</button>
          <span class="delete-msg text-xs text-red-500 hidden"></span>
        </div>
      </div>
    `;

    // 아코디언 토글
    el.querySelector('.accordion-trigger').addEventListener('click', () => {
      const isOpen = el.classList.contains('open');
      el.classList.toggle('open', !isOpen);
    });

    // 삭제 버튼
    const delBtn = el.querySelector('.delete-btn');
    const pwInput = el.querySelector('.delete-pw');
    const msg = el.querySelector('.delete-msg');

    delBtn.addEventListener('click', async () => {
      const pw = pwInput.value.trim();
      if (!pw) {
        showDeleteMsg(msg, '비밀번호를 입력하세요');
        return;
      }
      if (pw.length < 4) {
        showDeleteMsg(msg, '비밀번호는 4자 이상이어야 합니다');
        return;
      }
      await deletePost(item.id, pw, msg);
    });

    list.appendChild(el);
  });
}

function showDeleteMsg(el, text) {
  el.textContent = text;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

/* ── 페이지네이션 렌더 ── */
function renderPagination(total, page) {
  totalPages = Math.ceil(total / LIMIT) || 1;
  const wrap = document.getElementById('pagination');
  wrap.innerHTML = '';

  // << 처음
  if (page > 1) {
    wrap.appendChild(makePagBtn('«', 1));
    wrap.appendChild(makePagBtn('‹', page - 1));
  }

  // 페이지 번호 (현재 기준 ±4, 최대 10개)
  const groupSize = 10;
  const groupStart = Math.floor((page - 1) / groupSize) * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  for (let i = groupStart; i <= groupEnd; i++) {
    const a = makePagBtn(String(i), i);
    if (i === page) a.classList.add('active');
    wrap.appendChild(a);
  }

  // >> 끝
  if (page < totalPages) {
    wrap.appendChild(makePagBtn('›', page + 1));
    wrap.appendChild(makePagBtn('»', totalPages));
  }
}

function makePagBtn(label, page) {
  const a = document.createElement('a');
  a.textContent = label;
  a.href = '#';
  a.className = 'inline-flex items-center justify-center min-w-8 h-8 px-2 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-100 no-underline';
  a.addEventListener('click', (e) => {
    e.preventDefault();
    loadList(page);
  });
  return a;
}

/* ── API: 목록 조회 ── */
async function loadList(page = 1) {
  currentPage = page;
  try {
    const res = await fetch(`${API_BASE}?page=${page}&limit=${LIMIT}`);
    if (!res.ok) throw new Error('조회 실패');
    const json = await res.json();
    document.getElementById('totalCount').textContent = `총 ${json.meta.total}건`;
    renderList(json.data);
    renderPagination(json.meta.total, json.meta.page);
  } catch (e) {
    document.getElementById('requestList').innerHTML = '<p class="text-center py-12 text-gray-400 text-sm">목록을 불러오지 못했습니다.</p>';
  }
}

/* ── API: 등록 ── */
async function submitPost() {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const password = document.getElementById('postPassword').value;
  const msg = document.getElementById('formMsg');

  if (!title) {
    showFormMsg(msg, '제목을 입력하세요');
    return;
  }
  if (title.length > 50) {
    showFormMsg(msg, '제목은 50자를 초과할 수 없습니다');
    return;
  }
  if (!content) {
    showFormMsg(msg, '내용을 입력하세요');
    return;
  }
  if (content.length > 300) {
    showFormMsg(msg, '내용은 300자를 초과할 수 없습니다');
    return;
  }
  if (!password) {
    showFormMsg(msg, '비밀번호를 입력하세요');
    return;
  }
  if (password.length < 4) {
    showFormMsg(msg, '비밀번호는 4자 이상이어야 합니다');
    return;
  }
  if (password.length > 10) {
    showFormMsg(msg, '비밀번호는 10자를 초과할 수 없습니다');
    return;
  }

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, password }),
    });
    if (res.status === 201) {
      document.getElementById('postTitle').value = '';
      document.getElementById('postContent').value = '';
      document.getElementById('postPassword').value = '';
      document.getElementById('charCount').textContent = '0 / 300';
      showFormMsg(msg, '등록되었습니다.', true);
      loadList(1);
    } else {
      const err = await res.json().catch(() => ({}));
      showFormMsg(msg, err.message || '등록에 실패했습니다');
    }
  } catch (e) {
    showFormMsg(msg, '서버 오류가 발생했습니다');
  }
}

function showFormMsg(el, text, success = false) {
  el.textContent = text;
  el.className = `text-xs m-0 ${success ? 'text-green-500' : 'text-red-500'}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

/* ── API: 삭제 ── */
async function deletePost(id, password, msgEl) {
  try {
    const res = await fetch(`${API_BASE}/${id}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      loadList(currentPage);
    } else if (res.status === 401) {
      showDeleteMsg(msgEl, '비밀번호가 일치하지 않습니다');
    } else {
      const err = await res.json().catch(() => ({}));
      showDeleteMsg(msgEl, err.message || '삭제에 실패했습니다');
    }
  } catch (e) {
    showDeleteMsg(msgEl, '서버 오류가 발생했습니다');
  }
}

/* ── 이벤트 ── */
document.getElementById('submitBtn').addEventListener('click', submitPost);

document.getElementById('postContent').addEventListener('input', function () {
  document.getElementById('charCount').textContent = `${this.value.length} / 300`;
});

/* ── 초기 로드 ── */
loadList(1);
