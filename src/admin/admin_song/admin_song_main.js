const token = requireAuth();
let songs = [];
let categoryData = [];
let editIndex = null;
let tempYoutubeUrls = [];
let tempImageUrl = null;
const categoryDropdown = document.getElementById('categoryDropdown');
const selectCategoryBtn = document.getElementById('selectCategoryBtn');
const modal = document.getElementById('modal');
const songList = document.getElementById('songList');
const modalTitle = document.getElementById('newSong');
const artImageInput = document.getElementById('artImageInput');
const titleInput = document.getElementById('titleInput');
const artistInput = document.getElementById('artistInput');

const loadSongs = async (id = null) => {
  const data = await fetchSongs(id);
  if (!data) return;
  songs = data;
  renderSongs();
};

const loadCategories = async () => {
  const data = await fetchCategories();
  if (!data) return;
  categoryData = [{ title: '전체' }, ...data];
  renderCategoryDropdown();
  renderModalCategorySelect();
};

artImageInput.addEventListener('change', async () => {
  const file = artImageInput.files[0];
  if (!file) return;
  tempImageUrl = await uploadImage(file);
  alert('이미지가 등록되었습니다!');
});

const renderSongs = () => {
  songList.innerHTML = '';

  songs.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  songs.forEach((song, index) => {
    const trCreate = document.createElement('tr');
    trCreate.className = ' border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800';

    const tdRank = document.createElement('td');
    tdRank.className = ' font-bold  text-center font-bold text-gray-900 dark:text-gray-100';
    tdRank.textContent = index + 1;

    const tdSongNo = document.createElement('td');
    tdSongNo.className = '  font-bold text-center font-bold text-gray-900 dark:text-gray-100';
    tdSongNo.textContent = song.songNo;

    const tdArtImage = document.createElement('td');
    tdArtImage.className = '  font-bold text-center font-bold text-gray-900 dark:text-gray-100';

    if (song.imageUrl) {
      const albumImg = document.createElement('img');
      albumImg.src = song.imageUrl;
      albumImg.className = 'w-12 h-12 object-cover rounded mx-auto';
      tdArtImage.appendChild(albumImg);
    } else {
      tdArtImage.textContent = '미등록';
    }

    const tdTitle = document.createElement('td');
    tdTitle.className = '  font-bold  text-center font-bold text-gray-900 dark:text-gray-100';
    tdTitle.textContent = song.title;

    const tdCategory = document.createElement('td');
    tdCategory.className = 'font-bold text-center font-bold text-gray-900 dark:text-gray-100';
    tdCategory.textContent = song.category;

    const tdArtist = document.createElement('td');
    tdArtist.className = '  font-bold  text-center font-bold text-gray-900 dark:text-gray-100';
    tdArtist.textContent = song.artist;

    const tdScore = document.createElement('td');
    tdScore.className = 'p-4  text-center font-black text-red-600 dark:text-red-400';
    tdScore.textContent = song.score;

    const manageInner = document.createElement('div');
    manageInner.className = 'flex justify-center items-center gap-4 gap-2 flex-wrap';

    const tdManage = document.createElement('td');
    tdManage.className = 'p-4 justify-center items-center gap-4 text-xl font-bold';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'hover:text-red-500 hover:scale-125 transition dark:text-gray-200';
    deleteBtn.textContent = '✕';

    deleteBtn.addEventListener('click', async () => {
      if (confirm('이 노래를 삭제하시겠습니까?')) {
        await deleteSong(song.id);
        await loadSongs();
      }
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'text-lg border border-gray-400 dark:border-gray-600 px-2 py-1 text-gray-600 dark:text-gray-300 hover:border-red-600 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-400';
    editBtn.textContent = 'EDIT';

    editBtn.addEventListener('click', function () {
      editIndex = index;
      modalTitle.textContent = '노래 수정';
      document.getElementById('songNoInput').value = song.songNo;
      document.getElementById('titleInput').value = song.title;
      document.getElementById('artistInput').value = song.artist;
      document.getElementById('categoryInput').value = song.categoryId;
      document.getElementById('scoreInput').value = song.score;
      tempYoutubeUrls = song.url && Array.isArray(song.url) ? [...song.url] : [];
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
    if (song.urls && Array.isArray(song.urls)) {
      song.urls.forEach((url, urlIndex) => {
        if (url) {
          const urlSpan = document.createElement('span');
          urlSpan.className = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-lg px-2 py-1 rounded font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition';
          urlSpan.textContent = `URL ${urlIndex + 1}`;
          urlSpan.onclick = (e) => {
            e.stopPropagation();
            window.open(url.url, '_blank');
          };
          const urlDeleteBtn = document.createElement('button');
          urlDeleteBtn.className = ' w-6 h-6 inline-flex items-center text-red-500 dark:text-gray-300 justify-center text-lg  hover:text-red-700 dark:hover:text-red-700 font-bold ml-1 transition';
          urlDeleteBtn.textContent = '✕';

          urlDeleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('이 URL을 삭제하시겠습니까?')) {
              await deleteUrl(url.urlId);
              await loadSongs();
            }
          });

          urlSpan.appendChild(urlDeleteBtn);
          manageInner.appendChild(urlSpan);
        }
      });
    }
    tdManage.appendChild(manageInner);
    manageInner.append(editBtn, deleteBtn);

    trCreate.append(tdRank, tdSongNo, tdArtImage, tdTitle, tdArtist, tdCategory, tdScore, tdManage);

    songList.appendChild(trCreate);
  });
};
const saveSongBtn = document.getElementById('saveSongBtn');
saveSongBtn.addEventListener('click', async () => {
  const songNo = document.getElementById('songNoInput').value;
  const title = document.getElementById('titleInput').value;
  const artist = document.getElementById('artistInput').value;
  const categoryId = parseInt(document.getElementById('categoryInput').value);
  const score = parseInt(document.getElementById('scoreInput').value);

  if (title && artist && score !== null && !isNaN(score) && categoryId) {
    if (editIndex !== null) {
      await editSong(songs[editIndex].id, { songNo, title, artist, categoryId, score, imageUrl: tempImageUrl });
      if (tempYoutubeUrls.length > 0) {
        for (const url of tempYoutubeUrls) {
          await addSongUrl(songs[editIndex].id, url);
        }
      }
      editIndex = null;
      await loadSongs();
    } else {
      const newSong = await saveSongs({ songNo, title, artist, categoryId, score, imageUrl: tempImageUrl });
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

const addSongBtn = document.getElementById('addSongBtn');
addSongBtn.addEventListener('click', () => {
  editIndex = null;
  tempYoutubeUrls = [];
  modalTitle.textContent = '신규 노래 등록';
  document.getElementById('songNoInput').value = '';
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
  const existingCount = editIndex !== null && songs[editIndex]?.urls ? songs[editIndex].urls.length : 0;
  const totalCount = existingCount + tempYoutubeUrls.length;
  alert(`${totalCount}번의 유튜브 URL 등록이 완료되었습니다`);
});

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
document.getElementById('artImageBtn').addEventListener('click', () => {
  artImageInput.click();
});
const renderCategoryDropdown = () => {
  categoryDropdown.innerHTML = '';
  categoryData.forEach((info) => {
    const li = document.createElement('li');
    li.className = 'px-4 py-2 font-bold border-gray-100 dark:text-white text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700';
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

loadCategories();
loadSongs();
