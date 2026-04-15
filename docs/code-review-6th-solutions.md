# 6차 코드 리뷰 — 해결 가이드

> 이 문서는 [6차 코드 리뷰](./code-review-6th.md)에서 발견된 문제들의 해결 방법을 설명합니다.  
> 초보자도 따라할 수 있도록 단계별로 안내합니다.

---

## 목차

1. [`__MACOSX` 폴더 삭제하기](#1-macosx-폴더-삭제하기)
2. [admin_song.html 다크모드 추가하기](#2-admin_songhtml-다크모드-추가하기)
3. [인라인 style을 Tailwind 클래스로 바꾸기](#3-인라인-style을-tailwind-클래스로-바꾸기)
4. [인증 코드를 공통 모듈로 분리하기](#4-인증-코드를-공통-모듈로-분리하기)
5. [API 호출을 공통 함수로 만들기](#5-api-호출을-공통-함수로-만들기)
6. [큰 함수를 작은 함수로 나누기](#6-큰-함수를-작은-함수로-나누기)
7. [CSS `<style>` 블록을 Tailwind로 전환하기](#7-css-style-블록을-tailwind로-전환하기)
8. [기타 사소한 수정들](#8-기타-사소한-수정들)

---

## 1. `__MACOSX` 폴더 삭제하기

### 이게 뭔가요?

macOS에서 파일을 ZIP으로 압축하면 `__MACOSX`라는 숨김 폴더가 자동으로 생깁니다. 이 폴더에는 macOS 전용 메타데이터(파일 아이콘, 색상 태그 등)가 들어있습니다. 프로젝트에 필요 없는 파일이에요.

### 해결 방법

**Step 1**: `.gitignore` 파일에 아래 내용을 추가합니다.

```
# macOS 시스템 파일
__MACOSX/
.DS_Store
._*
```

> **`.gitignore` 파일이란?** Git에게 "이 파일들은 추적하지 마" 라고 알려주는 설정 파일입니다. 프로젝트 루트(최상위 폴더)에 있어야 합니다.

**Step 2**: 이미 커밋된 파일을 Git에서 제거합니다.

```bash
# Git 추적에서만 제거 (실제 파일은 남김)
git rm -r --cached src/user_js/font/__MACOSX

# 실제 파일도 삭제
rm -rf src/user_js/font/__MACOSX

# 커밋
git add .gitignore
git commit -m "불필요한 __MACOSX 폴더 삭제 및 .gitignore 추가"
```

> **`--cached` 옵션이란?** 이 옵션을 붙이면 Git의 추적 목록에서만 제거하고, 실제 파일은 컴퓨터에 남겨둡니다. 안전하게 작업할 수 있어요.

---

## 2. admin_song.html 다크모드 추가하기

### 현재 문제

`admin_song.html`의 `<body>`에 다크모드 클래스가 빠져 있습니다.

### 해결 방법

**Step 1**: `<body>` 태그를 수정합니다.

```html
<!-- 수정 전 -->
<body class="bg-gray-100 font-sans">

<!-- 수정 후 -->
<body class="bg-gray-100 dark:bg-gray-950 font-sans">
```

**Step 2**: `<main>` 태그에도 다크모드를 추가합니다.

```html
<!-- 수정 전 -->
<main class="flex-1 bg-white p-8 overflow-y-auto">

<!-- 수정 후 -->
<main class="flex-1 bg-white dark:bg-gray-900 p-8 overflow-y-auto">
```

**Step 3**: 모달에도 다크모드를 추가합니다.

```html
<!-- 수정 전 -->
<div id="modal" class="fixed inset-0 bg-black hidden items-center justify-center z-50">
  <div class="bg-white border-4 border-black p-8 w-[400px]">

<!-- 수정 후 -->
<div id="modal" class="fixed inset-0 bg-black/70 hidden items-center justify-center z-50">
  <div class="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8 w-[400px]">
```

**Step 4**: 테이블 헤더, 제목, 라벨 등에도 다크모드 텍스트 색상을 추가합니다.

```html
<!-- 예시: h1 태그 -->
<h1 class="text-3xl font-black dark:text-white">노래 관리</h1>

<!-- 예시: 라벨 -->
<label class="block font-black mb-1 dark:text-white">제목</label>
```

> **팁**: 다크모드 클래스를 추가할 때는 다른 관리자 페이지(`admin_category.html`, `admin_request.html`)를 참고하세요. 이미 다크모드가 적용되어 있어서 어떤 클래스를 쓰는지 볼 수 있습니다.

---

## 3. 인라인 style을 Tailwind 클래스로 바꾸기

### 어떤 것이 인라인 style인가요?

HTML에 직접 `style="..."` 을 쓰는 것을 인라인 스타일이라고 합니다.

```html
<!-- 이것이 인라인 스타일 -->
<th style="width: 5%">순위</th>
```

### 해결 방법: HTML 테이블 헤더

`soyu/admin_song.html`의 `<th>` 태그들을 수정합니다.

```html
<!-- 수정 전 -->
<th class="p-4 border-r-2 border-black text-center" style="width: 5%">순위</th>
<th class="p-4 border-r-2 border-black" style="width: 10%">노래방 번호</th>
<th class="p-4 border-r-2 border-black" style="width: 15%">앨범 아트</th>
<th class="p-4 border-r-2 border-black" style="width: 20%">제목</th>
<th class="p-4 border-r-2 border-black" style="width: 10%">가수</th>
<th class="p-4 border-r-2 border-black text-center" style="width: 10%">카테고리</th>
<th class="p-4 border-r-2 border-black text-center" style="width: 10%">점수</th>
<th class="p-4 text-center" style="width: 20%">관리</th>

<!-- 수정 후: Tailwind arbitrary value 사용 -->
<th class="p-4 border-r-2 border-black text-center w-[5%]">순위</th>
<th class="p-4 border-r-2 border-black w-[10%]">노래방 번호</th>
<th class="p-4 border-r-2 border-black w-[15%]">앨범 아트</th>
<th class="p-4 border-r-2 border-black w-[20%]">제목</th>
<th class="p-4 border-r-2 border-black w-[10%]">가수</th>
<th class="p-4 border-r-2 border-black text-center w-[10%]">카테고리</th>
<th class="p-4 border-r-2 border-black text-center w-[10%]">점수</th>
<th class="p-4 text-center w-[20%]">관리</th>
```

> **Tailwind arbitrary value란?** `w-[5%]` 처럼 대괄호 안에 원하는 값을 넣는 문법입니다. Tailwind에서 기본 제공하지 않는 값도 사용할 수 있어요.

### 해결 방법: JavaScript DOM 조작

`soyu/admin_song.js`에서 `style.width`를 쓰는 부분을 Tailwind 클래스로 변경합니다.

```javascript
// 수정 전
const tdRank = document.createElement('td');
tdRank.className = 'p-4 border-r-2 border-black text-center font-bold';
tdRank.style.width = '5%';

// 수정 후: className에 w-[5%]를 포함
const tdRank = document.createElement('td');
tdRank.className = 'p-4 border-r-2 border-black text-center font-bold w-[5%]';
```

그리고 `table` 태그에도 인라인 스타일 대신:

```html
<!-- 수정 전 -->
<table class="w-full text-left border-collapse" style="table-layout: fixed">

<!-- 수정 후 -->
<table class="w-full text-left border-collapse table-fixed">
```

> **`table-fixed`란?** Tailwind에서 제공하는 유틸리티 클래스로, CSS의 `table-layout: fixed`와 같은 효과입니다. 테이블 열 너비를 고정시켜 줍니다.

---

## 4. 인증 코드를 공통 모듈로 분리하기

### 현재 상태 (코드 반복)

3개 파일에서 같은 코드가 반복됩니다:

```
soyu/admin_category.js  →  토큰 체크 + 리다이렉트
soyu/admin_request.js   →  토큰 체크 + 리다이렉트 (동일)
soyu/admin_song.js      →  토큰 체크 + 리다이렉트 (동일)
```

### 해결 방법

**Step 1**: `soyu/auth.js` 파일을 새로 만듭니다.

```javascript
// soyu/auth.js

/**
 * 관리자 토큰을 확인하고, 없으면 로그인 페이지로 이동합니다.
 * 토큰이 있으면 토큰 값을 반환합니다.
 */
function requireAuth() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    location.href = './admin_open.html';
    return null;
  }
  return token;
}
```

**Step 2**: HTML 파일에서 `auth.js`를 먼저 불러옵니다.

```html
<!-- admin_category.html, admin_request.html, admin_song.html -->
<script src="../src/api-config.js"></script>
<script src="./auth.js"></script>        <!-- 추가 -->
<div id="header-container"></div>
<script src="./header.js"></script>
```

**Step 3**: 각 JS 파일에서 기존 인증 코드를 한 줄로 교체합니다.

```javascript
// 수정 전 (admin_category.js, admin_request.js, admin_song.js 모두)
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}

// 수정 후
const token = requireAuth();
```

### 이게 왜 좋은가요?

- **변경이 쉬워집니다**: 로그인 페이지 URL이 바뀌면 `auth.js` 한 곳만 수정하면 됩니다
- **실수가 줄어듭니다**: 5줄을 1줄로 줄이면 오타 가능성도 줄어듭니다
- **"높은 응집도"**: 인증과 관련된 코드가 `auth.js` 한 곳에 모여 있습니다

---

## 5. API 호출을 공통 함수로 만들기

### 현재 상태

23번이나 반복되는 패턴:

```javascript
try {
  const res = await fetch(`${API_BASE}/...`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    alert('○○에 실패했습니다.');
    return;
  }
  const json = await res.json();
  return json.data;
} catch {
  alert('서버 연결에 실패했습니다.');
}
```

### 해결 방법

**Step 1**: `soyu/api.js` (관리자용) 파일을 만듭니다.

```javascript
// soyu/api.js

/**
 * API 요청을 보내고 결과를 반환하는 공통 함수
 *
 * @param {string} url        - 요청할 API 경로 (예: '/songs')
 * @param {object} options    - fetch 옵션 (method, body 등)
 * @param {string} errorMsg   - 실패 시 보여줄 메시지
 * @returns {object|null}     - 성공 시 응답 데이터, 실패 시 null
 */
async function apiRequest(url, options = {}, errorMsg = '요청에 실패했습니다.') {
  const token = localStorage.getItem('adminToken');

  // 기본 헤더 설정
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // body가 있고, FormData가 아닌 경우에만 Content-Type 설정
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      alert(errorMsg);
      return null;
    }

    // DELETE 같은 요청은 응답 본문이 없을 수 있음
    const text = await res.text();
    if (!text) return true;

    const json = JSON.parse(text);
    return json.data;
  } catch {
    alert('서버 연결에 실패했습니다.');
    return null;
  }
}
```

**Step 2**: HTML에서 불러옵니다.

```html
<script src="../src/api-config.js"></script>
<script src="./auth.js"></script>
<script src="./api.js"></script>         <!-- 추가 -->
```

**Step 3**: 기존 코드를 간결하게 수정합니다.

```javascript
// ─── 수정 전: admin_song.js의 saveSongs 함수 (15줄) ───
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

// ─── 수정 후: 1줄 ───
const saveSongs = (data) =>
  apiRequest('/songs', { method: 'POST', body: JSON.stringify(data) }, '노래 저장에 실패했습니다.');
```

### 비교해 보세요

| | 수정 전 | 수정 후 |
|--|---------|---------|
| `admin_category.js`의 `saveCategory` | 13줄 | 2줄 |
| `admin_song.js`의 `saveSongs` | 15줄 | 2줄 |
| `admin_song.js`의 `editSong` | 14줄 | 2줄 |
| `admin_song.js`의 `deleteSong` | 13줄 | 2줄 |
| ... | ... | ... |
| **총 API 코드** | **~250줄** | **~50줄** |

### 이게 왜 좋은가요?

- **"낮은 결합도"**: 에러 처리 방식을 바꾸고 싶으면 `apiRequest` 함수 하나만 수정하면 됩니다
- **가독성**: 한 화면에 비즈니스 로직이 한눈에 보입니다
- **실수 방지**: `Authorization` 헤더를 빠뜨리는 실수가 사라집니다

---

## 6. 큰 함수를 작은 함수로 나누기

### 현재 상태: renderSongs() (120줄)

`admin_song.js`의 `renderSongs()` 함수가 하는 일:

```
renderSongs()
 ├── songList.innerHTML = ''           (초기화)
 ├── songs.sort(...)                    (정렬)
 └── songs.forEach(song => {
      ├── tr 생성
      ├── td 8개 생성 (순위, 번호, 앨범아트, 제목, 가수, 카테고리, 점수, 관리)
      ├── 삭제 버튼 + 이벤트
      ├── 수정 버튼 + 이벤트
      └── URL 목록 + 삭제 이벤트
     })
```

### 해결 방법: 기능별로 함수 분리

```javascript
// ─── 노래 한 행(tr)을 만드는 함수 ───
function createSongRow(song, index) {
  const tr = document.createElement('tr');
  tr.className = 'border-b-2 border-black hover:bg-gray-50';

  const cells = [
    createCell(index + 1, 'p-4 border-r-2 border-black text-center font-bold w-[5%]'),
    createCell(song.songNo, 'p-4 border-r-2 border-black font-bold w-[10%]'),
    createAlbumArtCell(song),
    createCell(song.title, 'p-4 border-r-2 border-black font-bold w-[20%]'),
    createCell(song.artist, 'p-4 border-r-2 border-black w-[10%]'),
    createCell(song.category, 'p-4 border-r-2 border-black text-center w-[10%]'),
    createScoreCell(song.score),
    createManageCell(song, index),
  ];

  cells.forEach((cell) => tr.appendChild(cell));
  return tr;
}

// ─── 일반 셀(td)을 만드는 함수 ───
function createCell(text, className) {
  const td = document.createElement('td');
  td.className = className;
  td.textContent = text;
  return td;
}

// ─── 앨범아트 셀을 만드는 함수 ───
function createAlbumArtCell(song) {
  const td = document.createElement('td');
  td.className = 'p-4 border-r-2 border-black font-bold w-[15%]';

  if (song.imageUrl) {
    const img = document.createElement('img');
    img.src = song.imageUrl;
    img.className = 'w-12 h-12 object-cover rounded mx-auto';
    td.appendChild(img);
  } else {
    td.textContent = '미등록';
  }

  return td;
}

// ─── 점수 셀 ───
function createScoreCell(score) {
  const td = document.createElement('td');
  td.className = 'p-4 border-r-2 border-black text-center font-black text-blue-600 w-[10%]';
  td.textContent = score;
  return td;
}

// ─── 관리 버튼 셀 ───
function createManageCell(song, index) {
  const td = document.createElement('td');
  td.className = 'p-4 justify-center items-center gap-4 text-xl font-bold w-[20%]';

  const wrap = document.createElement('div');
  wrap.className = 'flex justify-center items-center gap-2 flex-wrap';

  // 삭제 버튼
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'hover:text-red-500 hover:scale-125 transition';
  deleteBtn.textContent = '✘';
  deleteBtn.addEventListener('click', () => deleteSong(song.id));

  // 수정 버튼
  const editBtn = document.createElement('button');
  editBtn.className = 'text-sm border-2 border-black px-2 py-1 hover:bg-black hover:text-white';
  editBtn.textContent = 'EDIT';
  editBtn.addEventListener('click', () => openEditModal(song, index));

  wrap.append(deleteBtn, editBtn);

  // URL 배지들
  if (song.urls && Array.isArray(song.urls)) {
    song.urls.forEach((url, urlIndex) => {
      if (url) {
        wrap.appendChild(createUrlBadge(url, urlIndex));
      }
    });
  }

  td.appendChild(wrap);
  return td;
}

// ─── 최종 렌더 함수 (깔끔!) ───
const renderSongs = () => {
  songList.innerHTML = '';
  songs.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  songs.forEach((song, index) => {
    songList.appendChild(createSongRow(song, index));
  });
};
```

### 분리 전 vs 분리 후 비교

```
분리 전:
  renderSongs() ─── 120줄 (모든 것이 여기에)

분리 후:
  renderSongs()       ─── 6줄  (큰 그림만 보임)
  createSongRow()     ─── 15줄 (행 구조)
  createCell()        ─── 5줄  (일반 셀)
  createAlbumArtCell()─── 12줄 (앨범아트)
  createScoreCell()   ─── 5줄  (점수)
  createManageCell()  ─── 25줄 (관리 버튼들)
  createUrlBadge()    ─── 15줄 (URL 배지)
```

### 이게 왜 좋은가요?

- **읽기 쉬움**: `renderSongs()`를 보면 "정렬하고, 각 노래를 행으로 만든다"가 바로 보입니다
- **수정이 쉬움**: 앨범아트 표시를 바꾸고 싶으면 `createAlbumArtCell()`만 보면 됩니다
- **재사용 가능**: `createCell()` 함수는 어디서든 쓸 수 있습니다
- **"높은 응집도"**: 각 함수가 하나의 역할만 합니다

---

## 7. CSS `<style>` 블록을 Tailwind로 전환하기

### user_request.html의 아코디언 CSS

```css
/* 수정 전: <style> 블록 */
.accordion-body { display: none; }
.accordion-item.open .accordion-body { display: block; }
.accordion-item.open .accordion-arrow { transform: rotate(180deg); }
```

이 CSS는 "부모 요소의 클래스에 따라 자식의 스타일이 바뀌는" 패턴입니다.  
**Tailwind만으로는 이 패턴을 완벽히 대체하기 어렵습니다.**

### 해결 방법: JavaScript로 직접 토글

아코디언의 열기/닫기는 이미 JS에서 `classList.toggle('open')`으로 처리하고 있습니다.  
여기에 `hidden` 클래스와 `rotate-180` 클래스를 직접 토글하도록 바꿉니다.

```javascript
// user_request.js의 아코디언 토글 (이미 있는 코드 수정)
el.querySelector('.accordion-trigger').addEventListener('click', () => {
  const body = el.querySelector('.accordion-body');
  const arrow = el.querySelector('.accordion-arrow');

  body.classList.toggle('hidden');
  arrow.classList.toggle('rotate-180');
});
```

그리고 HTML에서:

```html
<!-- accordion-body에 hidden 클래스를 기본으로 추가 -->
<div class="accordion-body hidden bg-gray-50 ...">

<!-- accordion-arrow에 transition 추가 -->
<svg class="accordion-arrow w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200" ...>
```

이렇게 하면 CSS `<style>` 블록에서 아코디언 관련 3줄을 삭제할 수 있습니다.

### 페이지네이션 active 스타일

```css
/* 수정 전: <style> 블록 */
.pagination a.active {
  background-color: #dc2626;
  color: #fff;
  border-color: #dc2626;
  font-weight: 700;
}
```

이것은 JS에서 `active` 클래스를 추가할 때 Tailwind 클래스로 대체할 수 있습니다.

```javascript
// user_request.js의 renderPagination 함수 수정
if (i === page) {
  // 수정 전: CSS에 의존
  a.classList.add('active');

  // 수정 후: Tailwind 클래스 직접 적용
  a.classList.add('bg-red-600', 'text-white', 'border-red-600', 'font-bold');
}
```

### user_song.html의 body 폰트

```css
/* 이것은 CSS에 남겨둬도 됩니다 */
body { font-family: 'Malgun Gothic', '맑은 고딕', AppleSDGothicNeo, sans-serif; }
```

body에 적용하는 기본 폰트 설정은 CSS에 남겨두는 것이 합리적입니다. 다만, Tailwind의 `tailwind.config.js`에서 폰트를 설정하면 더 깔끔합니다.

### 최종 결과: 남겨야 할 CSS

수정 후에도 CSS에 남길 수 있는 것은 다음 정도입니다:

```html
<style>
  body {
    font-family: 'Malgun Gothic', '맑은 고딕', AppleSDGothicNeo, sans-serif;
  }
</style>
```

아코디언, 페이지네이션, 장르 탭의 active 스타일은 모두 Tailwind + JS로 처리할 수 있습니다.

---

## 8. 기타 사소한 수정들

### 8.1 console.log 삭제

```javascript
// soyu/admin_song.js:147 — 이 줄을 삭제하세요
console.log('응답 데이터:', json);
```

### 8.2 중복 클래스 수정

```javascript
// soyu/admin_song.js:283
// 수정 전: gap-4와 gap-2가 동시에 있음
manageInner.className = 'flex justify-center items-center gap-4 gap-2 flex-wrap';

// 수정 후: 하나만 남김
manageInner.className = 'flex justify-center items-center gap-2 flex-wrap';
```

### 8.3 글자 수 카운터 기준 통일

```javascript
// soyu/admin_song.js:75
// 수정 전: 20자에서 빨간색 (maxlength는 50)
el.className = count >= 20 ? 'text-sm text-red-500 ...' : 'text-sm text-gray-400 ...';

// 수정 후: maxlength와 일치시킴
el.className = count >= 50 ? 'text-sm text-red-500 mt-1 text-right' : 'text-sm text-gray-400 mt-1 text-right';
```

### 8.4 사용하지 않는 변수 삭제

```javascript
// soyu/admin_category.js:155 — 이 줄을 삭제하세요
const categoryDeleteBtn = document.querySelectorAll('.categoryDeleteBtn');

// soyu/admin_category.js:165 — 이 줄을 삭제하세요
const oldTitle = category[editIndex].title;
```

### 8.5 테마 저장소 통일

```javascript
// soyu/header.js
// 수정 전: sessionStorage 사용
sessionStorage.setItem('theme', 'dark');

// 수정 후: localStorage로 통일
localStorage.setItem('theme', 'dark');
```

`sessionStorage`를 쓰는 부분을 모두 `localStorage`로 변경하고, 읽는 부분도 맞춰서 수정합니다.

### 8.6 모달 토글 함수 만들기

```javascript
// 어디서든 쓸 수 있는 모달 열기/닫기 함수
function openModal() {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// 사용 예시
addSongBtn.addEventListener('click', () => {
  editIndex = null;
  tempYoutubeUrls = [];
  modalTitle.textContent = '신규 노래 등록';
  // ... 입력값 초기화 ...
  openModal();  // 한 줄로 깔끔!
});

closeSongBtn.addEventListener('click', closeModal);
```

### 8.7 @font-face를 CSS 파일로 이동

`src/user_js/user_header.js`에서 JS로 `<style>` 태그를 만드는 대신, CSS 파일에 넣습니다.

```css
/* src/style.css 또는 src/fonts.css */
@font-face {
  font-family: 'Jalnan2';
  src: url('./user_js/font/Jalnan2/Jalnan2TTF.ttf') format('truetype'),
       url('./user_js/font/Jalnan2/Jalnan2.otf') format('opentype');
}
```

그리고 `user_header.js`에서 `const jalnanStyle = ...` 부터 `document.head.appendChild(jalnanStyle);` 까지 9줄을 삭제합니다.

---

## 응집도와 결합도 — 쉽게 이해하기

이 문서에서 자주 나오는 "응집도"와 "결합도"를 정리합니다.

### 응집도 (Cohesion) — "관련된 것끼리 모아두기"

**높은 응집도 (좋음)**:
```
auth.js    → 인증 관련 코드만 있음
api.js     → API 호출 관련 코드만 있음
theme.js   → 테마 관련 코드만 있음
```

**낮은 응집도 (나쁨)**:
```
admin_category.js → 인증 체크 + API 호출 + DOM 조작 + 이벤트 처리 + 모달 제어 (전부 섞임)
```

> **비유**: 주방에 요리 도구, 청소 도구, 문구류가 섞여 있으면 원하는 것을 찾기 어렵죠. 요리 도구는 서랍에, 청소 도구는 창고에 두는 게 "높은 응집도"입니다.

### 결합도 (Coupling) — "서로 영향을 적게 주기"

**낮은 결합도 (좋음)**:
```
에러 메시지 방식을 바꾸고 싶다
  → apiRequest() 함수 하나만 수정하면 됨 ✅
```

**높은 결합도 (나쁨)**:
```
에러 메시지 방식을 바꾸고 싶다
  → 23개의 try/catch 블록을 전부 수정해야 함 ❌
```

> **비유**: 크리스마스 전구처럼 하나가 고장나면 전체가 꺼지는 건 "높은 결합도"입니다. 각 전구가 독립적으로 작동하는 게 "낮은 결합도"입니다.

---

## 작업 순서 추천

1. **먼저**: `__MACOSX` 삭제, `console.log` 삭제, 사용하지 않는 변수 삭제 (5분)
2. **그 다음**: `admin_song.html` 다크모드, 인라인 `style` → Tailwind (30분)
3. **그 다음**: `auth.js`, `api.js` 공통 모듈 만들기 (1시간)
4. **여유가 있을 때**: 큰 함수 분리, CSS → Tailwind 전환

한 번에 다 하려고 하지 않아도 됩니다. 위 순서대로 하나씩 PR을 올려보세요!
