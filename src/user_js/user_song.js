let currentCategory = '종합';
let currentSongs = [];

/* ══════════════════════════════════
   렌더 함수 (화면 그리기)
   ══════════════════════════════════ */

/* ── 카테고리 탭 렌더 ── */
function renderCategoryTabs(categories) {
  const categoryTabs = document.getElementById('categoryTabs');

  // 종합 탭 + API 카테고리 탭을 한 번에 생성
  categoryTabs.innerHTML = `
    <li><a class="str_type on block px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 no-underline whitespace-nowrap font-medium transition-colors duration-150 hover:text-red-600 dark:hover:text-red-400" data-category="종합">종합</a></li>
    ${categories
      .map(
        (item) => `
      <li><a class="str_type block px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 no-underline whitespace-nowrap font-medium transition-colors duration-150 hover:text-red-600 dark:hover:text-red-400" data-category="${item.title}" data-id="${item.id}">${item.title}</a></li>
    `
      )
      .join('')}
  `;

  // 이벤트 한 번에 연결
  categoryTabs.querySelectorAll('.str_type').forEach((a) => {
    a.addEventListener('click', () => setStrType(a.dataset.category, a.dataset.id, a));
  });
}

/* ── 차트 행 렌더 ── */
function renderChart(data) {
  const wrap = document.getElementById('chart-rows');
  wrap.innerHTML = '';

  if (!data.length) {
    wrap.innerHTML = '<p class="text-center py-10 text-gray-400 text-sm">검색 결과가 없습니다</p>';
    return;
  }

  data.forEach((s, index) => {
    const rank = index + 1;
    const rankColor = rank === 1 ? 'text-red-600' : rank === 2 ? 'text-orange-500' : rank === 3 ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400';

    // 차트 행
    const row = document.createElement('div');
    row.className = 'chart-grid grid border-b border-gray-100 dark:border-gray-700 items-center transition-colors duration-100 hover:bg-red-50 dark:hover:bg-gray-800';
    row.innerHTML = `
      <div class="px-2 py-3 text-center">
        <span class="text-lg font-extrabold ${rankColor}">${rank}</span>
      </div>
      <div class="px-2 py-3 text-center text-xs text-gray-400">${s.id}</div>
      <div class="px-2 py-3 flex justify-center">
        <div class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-base text-gray-400 dark:text-gray-500">♪</div>
      </div>
      <div class="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">${s.title}</div>
      <div class="px-2 py-3 text-left text-xs text-gray-500 dark:text-gray-400">${s.artist}</div>
      <div class="px-2 py-3 flex justify-center">
        <button class="yt-toggle inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer transition-colors duration-150 hover:border-red-600 hover:bg-red-50 dark:hover:border-red-400 dark:hover:bg-gray-700" title="유튜브" style="${s.urls && s.urls.length ? '' : 'pointer-events:none;opacity:0.3'}">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-red-600">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
          </svg>
        </button>
      </div>
    `;

    // 유튜브 아코디언 영역
    const ytPanel = document.createElement('div');
    ytPanel.className = 'yt-panel hidden bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-4 py-5';

    const urls = (s.urls || []).map((u) => u.url);

    if (urls.length) {
      ytPanel.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${urls
            .map((url) => {
              const videoId = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              if (!videoId) return '';
              return `
              <div class="relative w-full" style="padding-bottom:56.25%">
                <iframe
                  class="absolute inset-0 w-full h-full rounded"
                  src="https://www.youtube.com/embed/${videoId[1]}"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            `;
            })
            .join('')}
        </div>
      `;
    }

    // 유튜브 버튼 클릭 시 아코디언 토글
    row.querySelector('.yt-toggle').addEventListener('click', () => {
      ytPanel.classList.toggle('hidden');
    });

    wrap.appendChild(row);
    wrap.appendChild(ytPanel);
  });
}

/* ══════════════════════════════════
   데이터 함수 (API 호출)
   ══════════════════════════════════ */

/* ── 카테고리 목록 가져오기 ── */
async function loadCategories() {
  try {
    const res = await fetch('https://api.fullstackfamily.com/api/rawbeef/v1/categories');
    if (!res.ok) throw new Error('카테고리 조회 실패');
    const json = await res.json();
    renderCategoryTabs(json.data);
  } catch (e) {
    console.error('카테고리 로드 실패:', e);
  }

  await loadSongs();
}

/* ── 노래 목록 가져오기 ── */
async function loadSongs(categoryId) {
  try {
    const url = categoryId
      ? `https://api.fullstackfamily.com/api/rawbeef/v1/categories/${categoryId}`
      : 'https://api.fullstackfamily.com/api/rawbeef/v1/songs';

    const res = await fetch(url);
    if (!res.ok) throw new Error('조회 실패');
    const json = await res.json();

    // 종합: json.data가 배열 / 카테고리: json.data.songs가 배열
    currentSongs = Array.isArray(json.data) ? json.data : (json.data?.songs || []);
    renderChart(currentSongs);
  } catch (e) {
    document.getElementById('chart-rows').innerHTML = '<p class="text-center py-10 text-gray-400 text-sm">데이터를 불러오지 못했습니다</p>';
  }
}

/* ══════════════════════════════════
   이벤트 핸들러
   ══════════════════════════════════ */

/* ── 장르 탭 클릭 ── */
async function setStrType(type, id, el) {
  document.getElementById('strType').value = type;
  document.querySelectorAll('.str_type').forEach((a) => a.classList.remove('on'));
  el.classList.add('on');
  currentCategory = type;
  document.getElementById('keywordSearch').value = '';
  await loadSongs(id);
}

/* ── 검색 ── */
function doSearch() {
  const kw = document.getElementById('keywordSearch').value.trim().toLowerCase();
  if (!kw) {
    renderChart(currentSongs);
    return;
  }
  const filtered = currentSongs.filter((s) => s.title.toLowerCase().includes(kw) || s.artist.toLowerCase().includes(kw));
  renderChart(filtered);
}

document.getElementById('searchButton').addEventListener('click', doSearch);
document.getElementById('keywordSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

/* ══════════════════════════════════
   초기 실행
   ══════════════════════════════════ */
loadCategories();
