const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}
let songs = [];

async function loadSongs(id = null) {
  const apis = id ? `${API_BASE}/categories/${id}` : `${API_BASE}/songs`;

  const res = await fetch(apis);
  const json = await res.json();
  console.log(json);
  if (!res.ok) {
    alert(json.message ?? '불러오기에 실패했습니다.');
    return;
  }

  songs = id ? json.data.songs : json.data;
  console.log('songs:', songs); // 👈 추가

  renderSongs();
}

let editIndex = null;
let tempYoutubeUrls = [];
let categoryData = [];

const titleInput = document.getElementById('titleInput');
const artistInput = document.getElementById('artistInput');
const categoryInput = document.getElementById('categoryInput');

titleInput.addEventListener('input', () => {
  const count = titleInput.value.length;
  const el = document.getElementById('titleCount');
  el.textContent = `${count} / 50`;
  el.className = count >= 50 ? 'text-sm text-red-500 mt-1 text-right' : 'text-sm text-gray-400 mt-1 text-right';
});

artistInput.addEventListener('input', () => {
  const count = artistInput.value.length;
  const el = document.getElementById('artistCount');
  el.textContent = `${count} / 50`;
  el.className = count >= 20 ? 'text-sm text-red-500 mt-1 text-right' : 'text-sm text-gray-400 mt-1 text-right';
});

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const json = await res.json();
    if (!res.ok) {
      alert('카테고리를 불러오는 데 실패했습니다.');
      return;
    }

    categoryData = [{ title: '전체' }, ...json.data];
    renderCategoryDropdown();
    renderModalCategorySelect();
  } catch (error) {
    alert('카테고리를 불러오는 서버 연결에 실패했습니다');
  }
}
let currentFilter = '선택';

const editSong = async (id, songData) => {
  try {
    const res = await fetch(`${API_BASE}/songs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(songData),
    });
    if (!res.ok) {
      alert('노래 수정에 실패했습니다.');
      return;
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    alert('노래 수정 서버 연결 실패했습니다');
  }
};

const categoryDropdown = document.getElementById('categoryDropdown');
const selectCategoryBtn = document.getElementById('selectCategoryBtn');
const modal = document.getElementById('modal');
const songList = document.getElementById('songList');
const modalTitle = document.getElementById('newSong');
const youtubeLinkBtn = document.getElementById('youtubeLinkBtn');
const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
youtubeLinkBtn.addEventListener('click', () => {
  const url = prompt('유튜브 주소를 입력해주세요.');
  if (url === null) return;

  if (!youtubeRegex.test(url)) {
    alert('url 주소를 확인해 주세요');
    return;
  }
  tempYoutubeUrls.push(url);
  alert(`${tempYoutubeUrls.length}번의 유튜브 URL 등록이 완료되었습니다`);
});

const saveSongs = async (newSongData) => {
  console.log('저장 데이터:', newSongData);
  try {
    const res = await fetch(`${API_BASE}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSongData),
    });
    const json = await res.json();
    console.log('응답 데이터:', json);
    if (!res.ok) {
      alert('노래 저장에 실패했습니다.');
      return;
    }
    return json.data;
  } catch (error) {
    alert('노래 저장 서버 연결 실패했습니다');
  }
};

const addSongBtn = document.getElementById('addSongBtn');
addSongBtn.addEventListener('click', () => {
  editIndex = null;
  tempYoutubeUrls = [];
  modalTitle.textContent = '신규 노래 등록';
  document.getElementById('titleInput').value = '';
  document.getElementById('artistInput').value = '';
  document.getElementById('categoryInput').value = '';
  document.getElementById('scoreInput').value = 0;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
});
const closeSongBtn = document.getElementById('closeSongBtn');
closeSongBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});
const renderModalCategorySelect = () => {
  const select = document.getElementById('categoryInput');
  select.innerHTML = '<option value="">카테고리 선택</option>';
  categoryData.forEach((categoryItem) => {
    const option = document.createElement('option');
    option.value = categoryItem.id;
    option.textContent = categoryItem.title;
    select.appendChild(option);
  });
};

const renderCategoryDropdown = () => {
  categoryDropdown.innerHTML = '';
  categoryData.forEach((info) => {
    const li = document.createElement('li');
    li.className = 'px-4 py-2 font-bold  border-gray-100 text-sm';
    li.textContent = info.title;
    li.addEventListener('click', () => {
      currentFilter = info.title;
      if (info.title === '전체') {
        selectCategoryBtn.textContent = '카테고리 선택';
        loadSongs();
      } else {
        selectCategoryBtn.textContent = info.title;
        loadSongs(info.id);
      }

      categoryDropdown.classList.add('hidden');
    });

    categoryDropdown.appendChild(li);
  });
};

selectCategoryBtn.onclick = (e) => {
  e.stopPropagation();
  categoryDropdown.classList.toggle('hidden');
};

document.onclick = () => categoryDropdown.classList.add('hidden');

const renderSongs = () => {
  songList.innerHTML = '';

  songs.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  songs.forEach((song, index) => {
    const trCreate = document.createElement('tr');
    trCreate.className = 'border-b-2 border-black hover:bg-gray-50';

    const tdRank = document.createElement('td');
    tdRank.className = 'p-4 border-r-2 border-black text-center font-bold';
    tdRank.textContent = index + 1;

    const tdTitle = document.createElement('td');
    tdTitle.className = 'w-1/4 p-4 border-r-2 border-black font-bold';
    tdTitle.textContent = song.title;

    const tdCategory = document.createElement('td');
    tdCategory.className = 'p-4 border-r-2 border-black text-center';
    tdCategory.textContent = song.category;

    const tdArtist = document.createElement('td');
    tdArtist.className = 'w-1/4 p-4 border-r-2 border-black';
    tdArtist.textContent = song.artist;

    const tdScore = document.createElement('td');
    tdScore.className = 'p-4 border-r-2 border-black text-center font-black text-blue-600';
    tdScore.textContent = song.score;

    const tdManage = document.createElement('td');
    tdManage.className = 'p-4 flex justify-center items-center gap-4 text-xl font-bold';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'hover:text-red-500 hover:scale-125 transition';
    deleteBtn.textContent = '✘';

    deleteBtn.addEventListener('click', function () {
      deleteSong(song.id);
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'text-sm border-2 border-black px-2 py-1 hover:bg-black hover:text-white';
    editBtn.textContent = 'EDIT';

    editBtn.addEventListener('click', function () {
      editIndex = index;
      modalTitle.textContent = '노래 수정';
      document.getElementById('titleInput').value = song.title;
      document.getElementById('artistInput').value = song.artist;
      document.getElementById('categoryInput').value = song.categoryId;
      document.getElementById('scoreInput').value = song.score;
      tempYoutubeUrls = song.url && Array.isArray(song.url) ? [...song.url] : [];
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });

    tdManage.append(deleteBtn, editBtn);

    if (song.urls && Array.isArray(song.urls)) {
      song.urls.forEach((url, urlIndex) => {
        if (url) {
          const urlSpan = document.createElement('span');
          urlSpan.className = 'bg-green-300 text-green-900 text-s px-2 py-1 rounded font-bold  hover:bg-green-400';
          urlSpan.textContent = `URL${urlIndex + 1}`;
          urlSpan.onclick = (e) => {
            e.stopPropagation();
            window.open(url, '_blank');
          };
          tdManage.appendChild(urlSpan);
        }
      });
    }

    trCreate.append(tdRank, tdTitle, tdArtist, tdCategory, tdScore, tdManage);

    songList.appendChild(trCreate);
  });
};

const saveSongBtn = document.getElementById('saveSongBtn');
saveSongBtn.addEventListener('click', async () => {
  const title = document.getElementById('titleInput').value;
  const artist = document.getElementById('artistInput').value;
  const categoryId = parseInt(document.getElementById('categoryInput').value);
  const score = parseInt(document.getElementById('scoreInput').value);

  if (title && artist && score !== null && !isNaN(score) && categoryId) {
    if (editIndex !== null) {
      await editSong(songs[editIndex].id, { title, artist, categoryId, score });
      if (tempYoutubeUrls.length > 0) {
        for (const url of tempYoutubeUrls) {
          await addSongUrl(songs[editIndex].id, url);
        }
      }
      editIndex = null;
      await loadSongs();
    } else {
      const newSong = await saveSongs({ title, artist, categoryId, score });
      if (newSong && tempYoutubeUrls.length > 0) {
        for (const url of tempYoutubeUrls) {
          await addSongUrl(newSong.id, url);
        }
      }
      await loadSongs();
    }

    tempYoutubeUrls = [];
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  } else {
    alert('내용이 입력되지 않았습니다!');
  }
});
const addSongUrl = async (songId, url) => {
  try {
    const res = await fetch(`${API_BASE}/songs/${songId}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      alert('URL 추가에 실패했습니다.');
    }
  } catch {
    alert('서버 연결에 실패했습니다.');
  }
};

const deleteSong = async (id) => {
  if (confirm('이 노래를 삭제하시겠습니까?')) {
    try {
      const res = await fetch(`${API_BASE}/songs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        alert('노래 삭제에 실패했습니다.');
        return;
      }

      await loadSongs();
    } catch {
      alert('서버 연결에 실패했습니다.');
    }
  }
};

loadCategories();
loadSongs();
