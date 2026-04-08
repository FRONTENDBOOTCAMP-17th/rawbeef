let currentCategory = '종합';
let currentSongs = [];

/* ══════════════════════════════════
   렌더 함수 (화면 그리기)
   ══════════════════════════════════ */

/* ── 카테고리 탭 렌더 ── */
function renderCategoryTabs(categories) {
  const categoryTabs = document.getElementById('categoryTabs');

  // 종합 탭 + API 카테고리 탭을 한 번에 생성
  const tabClass =
    'str_type flex items-center justify-center text-center px-2 py-2 text-lg leading-7 no-underline border border-gray-400 bg-transparent text-gray-600 font-normal cursor-pointer whitespace-nowrap overflow-hidden transition-all duration-200 ' +
    'hover:border-red-600 hover:text-red-600 ' +
    'dark:border-gray-600 dark:text-gray-300 dark:hover:border-red-400 dark:hover:text-red-400 ' +
    '[&.on]:bg-red-600 [&.on]:border-red-600 [&.on]:text-white [&.on]:font-bold ' +
    'dark:[&.on]:bg-red-400 dark:[&.on]:border-red-400 dark:[&.on]:text-gray-900 ' +
    'lg:px-0 lg:py-[17px] lg:text-base lg:leading-[30px] xl:px-2.5';

  categoryTabs.innerHTML = `
    <li><a class="${tabClass} on" data-category="종합">종합</a></li>
    ${categories
      .map(
        (item) => `
      <li><a class="${tabClass}" data-category="${esc(item.title)}" data-id="${esc(item.id)}">${esc(item.title)}</a></li>
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
    row.className = 'grid grid-cols-10 py-3 gap-y-1 border-b border-gray-100 dark:border-gray-700 transition-colors duration-100 hover:bg-red-50 dark:hover:bg-gray-800 ' + 'md:grid-cols-26 md:place-items-center md:py-0 md:gap-y-0';
    row.innerHTML = `
      <div class="col-start-1 col-span-1 row-span-3 flex items-center justify-center md:col-start-auto md:col-span-2 md:row-span-1 md:block md:py-2 md:text-center">
        <span class="text-2xl font-extrabold ${rankColor}">${rank}</span>
      </div>
      <div class="col-start-3 col-span-6 row-start-3 pl-3 text-xs text-gray-500 dark:text-gray-400 self-center md:col-start-auto md:col-span-3 md:row-start-auto md:pl-0 md:py-2 md:text-xl md:text-center">${esc(s.songNo || ' ')}</div>
      <div class="col-start-2 col-span-1 row-span-3 flex items-center justify-center md:col-start-auto md:col-span-3 md:row-span-1 md:py-2">
${s.imageUrl ? `<img src="${s.imageUrl}" class="w-16 h-16 md:w-17.5 md:h-17.5 rounded object-cover" alt="${esc(s.title)}" />` : '<div class="w-16 h-16 md:w-17.5 md:h-17.5 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl text-gray-400 dark:text-gray-500">♪</div>'}
      </div>
      <div class="col-start-3 col-span-6 row-start-1 pl-3 text-base font-semibold text-gray-900 dark:text-gray-100 justify-self-start self-center md:col-start-9 md:col-span-11 md:row-start-auto md:pl-0 md:py-2 md:text-[22px]">${esc(s.title)}</div>
      <div class="col-start-3 col-span-6 row-start-2 pl-3 text-sm text-gray-500 dark:text-gray-400 justify-self-start self-center md:col-start-20 md:col-span-5 md:row-start-auto md:pl-6 md:py-2 md:text-[22px]">${esc(s.artist)}</div>
      <div class="col-start-9 col-span-2 row-span-3 flex items-center justify-end pr-3 md:col-start-auto md:col-span-2 md:row-span-1 md:justify-center md:pr-0 md:py-2">
        <button class="yt-toggle cursor-pointer border-none bg-transparent p-0 inline-flex" title="유튜브" style="${s.urls && s.urls.length ? '' : 'opacity:0.3'}">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 md:w-12 md:h-12">
            <path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/>
            <path fill="#fff" d="M9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
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
    } else {
      ytPanel.innerHTML = '<p class="text-center text-sm text-gray-400 m-0">등록된 유튜브 영상이 없습니다</p>';
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
    const res = await fetch(`${API_BASE}/categories`);
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
    const url = categoryId ? `${API_BASE}/categories/${categoryId}` : `${API_BASE}/songs`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('조회 실패');
    const json = await res.json();

    // 종합: json.data가 배열 / 카테고리: json.data.songs가 배열
    currentSongs = Array.isArray(json.data) ? json.data : json.data?.songs || [];
    currentSongs.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    currentSongs = currentSongs.slice(0, 10);
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
  const filtered = currentSongs.filter((s) => {
    const title = s.title.toLowerCase();
    const artist = s.artist.toLowerCase();
    const songNo = String(s.songNo).toLowerCase();

    return title.includes(kw) || artist.includes(kw) || songNo.includes(kw);
  });
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
