//노래 조회 API
const fetchSongs = async (id = null) => {
  try {
    const apis = id ? `${API_BASE}/categories/${id}` : `${API_BASE}/songs`;

    const res = await fetch(apis);
    const json = await res.json();

    if (!res.ok) {
      alert(json.message ?? '불러오기에 실패했습니다.');
      return null;
    }
    return id ? json.data.songs : json.data;
  } catch {
    alert('서버 연결에 실패했습니다.');
    return null;
  }
};

// 노래 저장 Api
const saveSongs = async (newSongData) => {
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

    if (!res.ok) {
      alert('노래 저장에 실패했습니다.');
      return;
    }
    return json.data;
  } catch (error) {
    alert('노래 저장 서버 연결 실패했습니다');
    return null;
  }
};

//노래 수정 API
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
    return null;
  }
};

//노래 삭제 api

const deleteSong = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/songs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert('노래 삭제에 실패했습니다.');
      return;
    }
  } catch {
    // ← try 닫고 나서 catch
    alert('노래 삭제 서버 연결 실패했습니다');
  }
};

// 카테고리 불러오기
const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const json = await res.json();
    if (!res.ok) {
      alert('카테고리를 불러오는 데 실패했습니다.');
      return null;
    }
    return json.data;
  } catch {
    alert('카테고리를 불러오는 서버 연결에 실패했습니다');
    return null;
  }
};
// 앨범 아트 이미지 url, 유튜브 url
const uploadImage = async (file) => {
  try {
    const artImageUrl = new FormData();
    artImageUrl.append('image', file);
    const res = await fetch(`${API_BASE}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: artImageUrl,
    });
    if (!res.ok) {
      alert('이미지 업로드에 실패했습니다.');
      return null;
    }
    const json = await res.json();
    return json.data.imageUrl;
  } catch {
    alert('서버 연결에 실패했습니다.');
    return null;
  }
};

// 유튜브 url 등록

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

// 유튜브 url 삭제

const deleteUrl = async (urlId) => {
  try {
    const res = await fetch(`${API_BASE}/songs/urls/${urlId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert('URL 삭제에 실패했습니다.');
    }
  } catch {
    alert('서버 연결에 실패했습니다.');
  }
};
