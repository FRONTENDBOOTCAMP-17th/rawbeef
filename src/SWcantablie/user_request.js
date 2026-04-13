const REQUEST_API = `${API_BASE}/requests`;
const LIMIT = 30;
let currentPage = 1;
let totalPages = 1;

/* ══════════════════════════════════
   렌더 함수 (화면 그리기)
   ══════════════════════════════════ */

/* ── 날짜 포맷 ── */
function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

/* ── 관리자 토큰 ── */
function getAdminToken() {
  return localStorage.getItem('adminToken');
}

function showDeleteMsg(el, text) {
  el.textContent = text;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

function showFormMsg(el, text, success = false) {
  el.textContent = text;
  el.className = `text-xs m-0 ${success ? 'text-green-500' : 'text-red-500'}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

/* ── 목록 렌더 ── */
function renderList(data) {
  const list = document.getElementById('requestList');
  list.innerHTML = '';

  if (!data.length) {
    list.innerHTML = '<p class="text-center py-12 text-gray-400 text-sm">등록된 신청이 없습니다.</p>';
    return;
  }

  const isAdmin = !!getAdminToken();

  data.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'accordion-item border-b border-gray-100 dark:border-gray-700';
    el.innerHTML = `
      <!-- 아코디언 헤더 -->
      <button
        class="accordion-trigger w-full grid text-left px-3 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-100 cursor-pointer bg-transparent border-none font-[inherit]"
        style="grid-template-columns: 60px 1fr 80px;"
      >
        <span class="text-xs text-gray-400 text-center self-center">${esc(item.id)}</span>
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100 self-center flex items-center gap-2">
          ${esc(item.title)}
          ${item.comment ? `<span class="text-xs text-red-500 font-semibold">[1]</span>` : ''}
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
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-5">${esc(item.content)}</p>

        <!-- 댓글(답변) -->
        ${
          item.comment
            ? `
          <div class="mb-5">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">답변</p>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-3 mb-2">
              <p class="text-sm text-gray-700 dark:text-gray-300 m-0 whitespace-pre-wrap">${esc(item.comment.content)}</p>
              <p class="text-xs text-gray-400 mt-1 mb-0">${esc(formatDate(item.comment.createdAt))}</p>
            </div>
            ${
              isAdmin
                ? `<button
                    class="comment-delete-btn h-7 px-3 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-gray-800 text-red-500 text-xs font-semibold rounded border border-red-200 dark:border-red-800 cursor-pointer transition-colors duration-150 font-[inherit]"
                    data-comment-id="${esc(item.comment.commentId)}"
                  >답변 삭제</button>
                  <span class="comment-msg text-xs text-red-500 hidden ml-2"></span>`
                : ''
            }
          </div>
        `
            : isAdmin
              ? `
          <div class="mb-5">
            <p class="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-2">관리자 답변 등록</p>
            <textarea
              class="comment-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 placeholder:text-gray-400 transition-colors duration-150 resize-none"
              rows="3"
              placeholder="답변을 입력하세요 (1~500자)"
              maxlength="500"
            ></textarea>
            <div class="flex items-center gap-2 mt-2">
              <button class="comment-submit-btn h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded border-none cursor-pointer transition-colors duration-150 font-[inherit]">답변 등록</button>
              <span class="comment-msg text-xs text-red-500 hidden"></span>
            </div>
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
            data-id="${esc(item.id)}"
          >삭제</button>
          ${
            isAdmin
              ? `
          <button
            class="admin-delete-btn h-9 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded border-none cursor-pointer transition-colors duration-150 font-[inherit]"
            data-id="${esc(item.id)}"
          >관리자 삭제</button>
          `
              : ''
          }
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

    // 관리자: 신청 삭제
    if (isAdmin) {
      const adminDelBtn = el.querySelector('.admin-delete-btn');
      const adminDelMsg = el.querySelector('.delete-msg');
      adminDelBtn.addEventListener('click', async () => {
        await adminDeletePost(item.id, adminDelMsg);
      });
    }

    // 관리자: 답변 등록
    if (isAdmin && !item.comment) {
      const commentSubmitBtn = el.querySelector('.comment-submit-btn');
      const commentInput = el.querySelector('.comment-input');
      const commentMsg = el.querySelector('.comment-msg');

      commentSubmitBtn.addEventListener('click', async () => {
        const content = commentInput.value.trim();
        if (!content) {
          showDeleteMsg(commentMsg, '답변을 입력하세요');
          return;
        }
        await addComment(item.id, content, commentMsg);
      });
    }

    // 관리자: 답변 삭제
    if (isAdmin && item.comment) {
      const commentDeleteBtn = el.querySelector('.comment-delete-btn');
      const commentMsg = el.querySelector('.comment-msg');

      commentDeleteBtn.addEventListener('click', async () => {
        await deleteComment(item.comment.commentId, commentMsg);
      });
    }

    list.appendChild(el);
  });
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

/* ══════════════════════════════════
   데이터 함수 (API 호출)
   ══════════════════════════════════ */

/* ── 목록 조회 ── */
async function loadList(page = 1) {
  currentPage = page;
  try {
    const res = await fetch(`${REQUEST_API}?page=${page}&limit=${LIMIT}`);
    if (!res.ok) throw new Error('조회 실패');
    const json = await res.json();
    document.getElementById('totalCount').textContent = `총 ${json.meta.total}건`;
    renderList(json.data);
    renderPagination(json.meta.total, json.meta.page);
  } catch (e) {
    document.getElementById('requestList').innerHTML = '<p class="text-center py-12 text-gray-400 text-sm">목록을 불러오지 못했습니다.</p>';
  }
}

/* ── 등록 ── */
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
    const res = await fetch(REQUEST_API, {
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

/* ── 신청 삭제 (관리자) ── */
async function adminDeletePost(id, msgEl) {
  try {
    const res = await fetch(`${REQUEST_API}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    if (res.ok) {
      loadList(currentPage);
    } else if (res.status === 401) {
      showDeleteMsg(msgEl, '인증이 만료되었습니다. 다시 로그인해주세요');
    } else {
      const err = await res.json().catch(() => ({}));
      showDeleteMsg(msgEl, err.message || '삭제에 실패했습니다');
    }
  } catch (e) {
    showDeleteMsg(msgEl, '서버 오류가 발생했습니다');
  }
}

/* ── 댓글 등록 (관리자) ── */
async function addComment(id, content, msgEl) {
  try {
    const res = await fetch(`${REQUEST_API}/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ content }),
    });
    if (res.status === 201) {
      loadList(currentPage);
    } else if (res.status === 400) {
      showDeleteMsg(msgEl, '이미 답변이 등록되어 있습니다');
    } else if (res.status === 401) {
      showDeleteMsg(msgEl, '인증이 만료되었습니다. 다시 로그인해주세요');
    } else {
      const err = await res.json().catch(() => ({}));
      showDeleteMsg(msgEl, err.message || '답변 등록에 실패했습니다');
    }
  } catch (e) {
    showDeleteMsg(msgEl, '서버 오류가 발생했습니다');
  }
}

/* ── 댓글 삭제 (관리자) ── */
async function deleteComment(commentId, msgEl) {
  try {
    const res = await fetch(`${REQUEST_API}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    if (res.ok) {
      loadList(currentPage);
    } else if (res.status === 401) {
      showDeleteMsg(msgEl, '인증이 만료되었습니다. 다시 로그인해주세요');
    } else {
      const err = await res.json().catch(() => ({}));
      showDeleteMsg(msgEl, err.message || '답변 삭제에 실패했습니다');
    }
  } catch (e) {
    showDeleteMsg(msgEl, '서버 오류가 발생했습니다');
  }
}

/* ── 삭제 ── */
async function deletePost(id, password, msgEl) {
  try {
    const res = await fetch(`${REQUEST_API}/${id}/delete`, {
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

/* ══════════════════════════════════
   이벤트 핸들러
   ══════════════════════════════════ */

document.getElementById('submitBtn').addEventListener('click', submitPost);

document.getElementById('postContent').addEventListener('input', function () {
  document.getElementById('charCount').textContent = `${this.value.length} / 300`;
});

/* ══════════════════════════════════
   초기 실행
   ══════════════════════════════════ */
loadList(1);
