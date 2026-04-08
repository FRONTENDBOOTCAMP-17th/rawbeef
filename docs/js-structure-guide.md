# JavaScript 파일 구조화 가이드

> TJ미디어 노래방 차트 프로젝트를 위한 JS 파일 정리 가이드입니다.
> 현재 코드를 분석하고, 더 유지보수하기 쉬운 구조로 개선하는 방법을 단계별로 설명합니다.

---

## 목차

1. [현재 우리 프로젝트의 구조](#1-현재-우리-프로젝트의-구조)
2. [지금 구조에서 불편한 점](#2-지금-구조에서-불편한-점)
3. [폴더 구조를 어떻게 바꿀까?](#3-폴더-구조를-어떻게-바꿀까)
4. [JS 파일을 나누는 기준 — "역할별로 나누자"](#4-js-파일을-나누는-기준--역할별로-나누자)
5. [실전 리팩토링: 단계별 따라하기](#5-실전-리팩토링-단계별-따라하기)
6. [한눈에 보는 Before / After 비교표](#6-한눈에-보는-before--after-비교표)
7. [파일 이름 짓는 규칙](#7-파일-이름-짓는-규칙)
8. [자주 하는 실수와 해결법](#8-자주-하는-실수와-해결법)
9. [체크리스트: 새 기능을 추가할 때](#9-체크리스트-새-기능을-추가할-때)

---

## 1. 현재 우리 프로젝트의 구조

지금 프로젝트의 JS 파일이 어디에 있는지 먼저 살펴봅시다.

```
rawbeef/
├── src/
│   ├── api-config.js          ← API 주소 설정 (1줄)
│   ├── main.js                ← 진입점 (CSS import만)
│   └── user_js/               ← 사용자 페이지 JS
│       ├── theme.js           ← 다크모드 토글 (25줄)
│       ├── user_header.js     ← 헤더 HTML (13줄)
│       ├── user_footer.js     ← 푸터 HTML (63줄)
│       ├── user_song.js       ← 노래 차트 페이지 (182줄)
│       └── user_request.js    ← 노래 신청 페이지 (430줄) ← 가장 큰 파일!
│
├── soyu/                      ← 관리자 페이지 JS
│   ├── header.js              ← 관리자 헤더 (58줄)
│   ├── sidebar.js             ← 사이드바 메뉴 (46줄)
│   ├── admin_category.js      ← 카테고리 관리 (200줄)
│   ├── admin_song.js          ← 노래 관리 (363줄)
│   └── admin_request.js       ← 신청 관리 (173줄)
│
└── woohyun/                   ← 사용자 HTML 페이지
    ├── user_song.html
    └── user_request.html
```

**총 JS 파일 10개, 합계 약 1,553줄**

---

## 2. 지금 구조에서 불편한 점

### 문제 1: 같은 코드가 여러 파일에 반복됨 (코드 중복)

XSS 방지 함수 `esc()`가 두 곳에 똑같이 있습니다:

```javascript
// 📁 src/user_js/user_song.js (4~7줄)
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 📁 src/user_js/user_request.js (7~9줄) ← 똑같은 코드!
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

**왜 문제인가요?**
- 나중에 `esc()` 함수를 고칠 일이 생기면, 두 파일 모두 수정해야 합니다
- 하나만 고치고 다른 하나를 깜빡하면 버그가 생깁니다
- 파일이 10개가 아니라 100개가 되면 더 심각해집니다

### 문제 2: API 주소가 여기저기 흩어져 있음

```javascript
// 📁 src/api-config.js — 공용 설정 파일이 있지만...
const API_BASE = 'https://api.fullstackfamily.com/api/rawbeef/v1';

// 📁 src/user_js/user_song.js (119, 133줄) — 여기서는 직접 URL을 적어놓음!
const res = await fetch('https://api.fullstackfamily.com/api/rawbeef/v1/categories');
// ...
const url = categoryId
  ? `https://api.fullstackfamily.com/api/rawbeef/v1/categories/${categoryId}`
  : 'https://api.fullstackfamily.com/api/rawbeef/v1/songs';

// 📁 src/user_js/user_request.js (1줄) — 여기서는 또 다른 방식으로!
const API_BASE = 'https://api.fullstackfamily.com/api/rawbeef/v1/requests';
```

**왜 문제인가요?**
- API 서버 주소가 바뀌면 모든 파일을 찾아다니며 수정해야 합니다
- `api-config.js`를 만들어놓고도 안 쓰는 파일이 있으면 의미가 없습니다

### 문제 3: 하나의 파일에 너무 많은 역할이 들어있음

`user_request.js` (430줄)을 살펴보면, 한 파일 안에 이 모든 것이 섞여 있습니다:

```
user_request.js (430줄)
├── XSS 방지 함수 (esc)           ← 유틸리티 도구
├── 날짜 포맷 함수 (formatDate)    ← 유틸리티 도구
├── 관리자 토큰 확인              ← 인증 로직
├── 목록 렌더링 (renderList)       ← 화면 그리기
├── 페이지네이션 (renderPagination) ← 화면 그리기
├── API 호출 5개                   ← 서버 통신
│   ├── loadList()
│   ├── submitPost()
│   ├── deletePost()
│   ├── adminDeletePost()
│   ├── addComment()
│   └── deleteComment()
├── 이벤트 핸들러                  ← 사용자 입력 처리
└── 초기 실행 코드                 ← 페이지 시작
```

**왜 문제인가요?**
- "API 호출 부분만 고치고 싶은데" 430줄짜리 파일을 위아래로 스크롤해야 합니다
- 어디가 화면 관련 코드이고, 어디가 서버 통신 코드인지 한눈에 안 보입니다
- 두 사람이 동시에 수정하면 git 충돌이 자주 발생합니다

### 문제 4: 다크모드 구현이 두 벌임

```javascript
// 📁 src/user_js/theme.js — 사용자 페이지용 (localStorage 사용)
const saved = localStorage.getItem('theme');

// 📁 soyu/header.js — 관리자 페이지용 (sessionStorage 사용!)
applyTheme(sessionStorage.getItem('theme') !== 'light');
```

**왜 문제인가요?**
- 사용자 페이지에서 다크모드로 바꿨는데, 관리자 페이지에서는 안 바뀝니다
- 같은 기능인데 저장 방식이 달라서 혼란스럽습니다

### 문제 5: 팀원별 폴더 분리의 한계

```
soyu/        ← 소유님이 만든 파일
woohyun/     ← 우현님이 만든 파일
src/user_js/ ← 이것도 우현님 영역?
```

**왜 문제인가요?**
- "이 파일 어디있지?" → 사람 이름별로 찾아야 하는데, 기능별로 찾고 싶을 때가 더 많습니다
- 공통 코드(헤더, 다크모드 등)가 어디에 있어야 할지 애매합니다

---

## 3. 폴더 구조를 어떻게 바꿀까?

### 핵심 원칙: "사람별"이 아니라 "역할별"로 나누자

지금은 **"누가 만들었나"** 기준이지만, **"무슨 역할을 하나"** 기준으로 바꿉니다.

### 추천 폴더 구조

```
src/
├── js/
│   ├── common/               ← 모든 페이지에서 공통으로 쓰는 것
│   │   ├── api.js            ← API 호출 도구 (fetch 래퍼)
│   │   ├── utils.js          ← 유틸 함수 (esc, formatDate 등)
│   │   └── auth.js           ← 로그인/토큰 관련
│   │
│   ├── components/           ← 재사용 가능한 UI 조각
│   │   ├── header.js         ← 헤더 (사용자/관리자 통합)
│   │   ├── footer.js         ← 푸터
│   │   ├── sidebar.js        ← 관리자 사이드바
│   │   ├── pagination.js     ← 페이지네이션
│   │   └── theme.js          ← 다크모드 토글
│   │
│   └── pages/                ← 각 페이지의 메인 로직
│       ├── user-song.js      ← 사용자 차트 페이지
│       ├── user-request.js   ← 사용자 신청 페이지
│       ├── admin-category.js ← 관리자 카테고리 관리
│       ├── admin-song.js     ← 관리자 노래 관리
│       └── admin-request.js  ← 관리자 신청 관리
│
├── style.css
└── main.js
```

### 왜 이렇게 나누나요?

| 폴더 | 역할 | 비유 |
|------|------|------|
| `common/` | 여러 곳에서 쓰는 도구 모음 | 공용 도구함 (망치, 드라이버) |
| `components/` | 화면에 보이는 재사용 UI 조각 | 레고 블록 (조립해서 쓰는 것) |
| `pages/` | 각 HTML 페이지의 메인 로직 | 완성된 방 (블록을 조합한 결과) |

**비유로 이해하기:**
- `common/api.js` = 레스토랑의 **주방 도구** (칼, 도마) — 모든 요리에 쓰임
- `components/header.js` = 레스토랑의 **반찬** — 어떤 메뉴에나 함께 나옴
- `pages/user-song.js` = **메인 요리** — 그 페이지에서만 나오는 메인 로직

---

## 4. JS 파일을 나누는 기준 — "역할별로 나누자"

하나의 큰 파일을 작은 파일로 나눌 때, **"이 코드는 무슨 역할을 하나?"** 를 기준으로 합니다.

### 역할 분류표

| 역할 | 설명 | 예시 | 어디에 넣을까 |
|------|------|------|-------------|
| **유틸리티** | 데이터를 변환하는 순수 함수 | `esc()`, `formatDate()` | `common/utils.js` |
| **API 통신** | 서버와 데이터를 주고받는 함수 | `fetch()` 호출들 | `common/api.js` |
| **인증** | 로그인, 토큰 관련 | `getAdminToken()` | `common/auth.js` |
| **UI 컴포넌트** | 화면에 HTML을 그리는 함수 | `renderChart()`, 헤더/푸터 | `components/` |
| **페이지 로직** | 위의 것들을 조합해서 페이지를 완성 | 이벤트 연결, 초기화 | `pages/` |

### 쉽게 판단하는 방법

코드를 보고 이렇게 질문해보세요:

```
Q: "이 함수가 다른 페이지에서도 쓸 수 있나?"
   → Yes → common/ 또는 components/
   → No  → pages/

Q: "이 함수가 화면(DOM)을 건드리나?"
   → Yes → components/ 또는 pages/
   → No  → common/

Q: "이 함수가 서버에 fetch 요청을 보내나?"
   → Yes → common/api.js
   → No  → 다른 곳
```

---

## 5. 실전 리팩토링: 단계별 따라하기

현재 코드를 실제로 어떻게 개선하는지 `user_request.js`를 예시로 단계별로 보여드립니다.

### STEP 1: 유틸리티 함수 분리하기

**Before** — `user_request.js` 안에 유틸 함수가 섞여 있음:

```javascript
// 📁 src/user_js/user_request.js (현재)
const API_BASE = 'https://api.fullstackfamily.com/api/rawbeef/v1/requests';

function esc(str) { /* ... */ }
function formatDate(iso) { /* ... */ }

// ... 나머지 400줄의 코드 ...
```

**After** — 유틸 함수를 별도 파일로 꺼내기:

```javascript
// 📁 src/js/common/utils.js (새로 만든 파일)

/**
 * XSS 공격을 방지하기 위해 HTML 특수문자를 이스케이프합니다.
 * 사용자가 입력한 텍스트를 innerHTML로 넣을 때 반드시 사용하세요.
 */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * ISO 날짜 문자열을 "2025.04.07" 형태로 변환합니다.
 */
function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}
```

> **포인트:** `esc()`와 `formatDate()`는 어떤 페이지든 쓸 수 있는 "도구"니까 `common/`으로 갑니다.

### STEP 2: API 호출 함수 분리하기

**Before** — 페이지 파일에 fetch 호출이 직접 들어있음:

```javascript
// 📁 src/user_js/user_request.js (현재)
async function loadList(page = 1) {
  const res = await fetch(`${API_BASE}?page=${page}&limit=${LIMIT}`);
  if (!res.ok) throw new Error('조회 실패');
  const json = await res.json();
  // ...
}

async function submitPost() {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, password }),
  });
  // ...
}
```

**After** — API 호출을 전담하는 파일 만들기:

```javascript
// 📁 src/js/common/api.js (새로 만든 파일)

const API_BASE = 'https://api.fullstackfamily.com/api/rawbeef/v1';

/**
 * GET 요청을 보내고 JSON을 반환합니다.
 * @param {string} path - API 경로 (예: '/songs', '/categories')
 * @param {object} params - 쿼리 파라미터 (예: { page: 1, limit: 30 })
 */
async function apiGet(path, params = {}) {
  // 쿼리스트링 만들기: { page: 1, limit: 30 } → "?page=1&limit=30"
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}${path}${query ? '?' + query : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res.json();
}

/**
 * POST 요청을 보냅니다 (새 데이터 생성용).
 * @param {string} path - API 경로
 * @param {object} body - 보낼 데이터
 * @param {string} token - 관리자 토큰 (필요한 경우)
 */
async function apiPost(path, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res.json();
}

/**
 * DELETE 요청을 보냅니다 (데이터 삭제용).
 */
async function apiDelete(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res;
}

/**
 * PATCH 요청을 보냅니다 (데이터 수정용).
 */
async function apiPatch(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res.json();
}
```

이제 페이지에서는 이렇게 쓸 수 있습니다:

```javascript
// 📁 src/js/pages/user-request.js (개선된 버전)
// 이전: const res = await fetch(`${API_BASE}?page=${page}&limit=${LIMIT}`);
// 이후:
const json = await apiGet('/requests', { page, limit: LIMIT });
```

> **포인트:** `API_BASE` 주소가 `api.js` 한 곳에만 있으니, 서버 주소가 바뀌면 **1곳만** 수정하면 됩니다!

### STEP 3: 인증 로직 분리하기

**Before** — 인증 체크가 여러 파일에 반복됨:

```javascript
// 📁 soyu/admin_song.js (1~5줄)
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}

// 📁 soyu/admin_category.js (1~5줄) ← 똑같은 코드!
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}

// 📁 soyu/admin_request.js (1~5줄) ← 또 똑같은 코드!
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}
```

**After** — 한 곳에서 관리:

```javascript
// 📁 src/js/common/auth.js (새로 만든 파일)

/**
 * 저장된 관리자 토큰을 가져옵니다.
 * @returns {string|null} 토큰 문자열 또는 null
 */
function getAdminToken() {
  return localStorage.getItem('adminToken');
}

/**
 * 관리자 로그인 여부를 확인합니다.
 * 로그인이 안 되어 있으면 로그인 페이지로 이동합니다.
 */
function requireAdmin() {
  const token = getAdminToken();
  if (!token) {
    alert('로그인이 필요합니다.');
    location.href = './admin_open.html';
  }
  return token;
}
```

이제 관리자 페이지에서는 한 줄이면 됩니다:

```javascript
// 📁 src/js/pages/admin-song.js (개선된 버전)
const token = requireAdmin(); // 끝! 로그인 체크 + 토큰 가져오기
```

### STEP 4: 페이지 파일 정리하기

공통 코드를 꺼낸 뒤, 페이지 파일에는 **"이 페이지만의 로직"** 만 남깁니다.

```javascript
// 📁 src/js/pages/user-request.js (개선된 버전, 훨씬 짧아짐!)

// ── 설정 ──
const LIMIT = 30;
let currentPage = 1;

// ── 화면 그리기 ──
function renderList(data) {
  // renderList 로직 (이 페이지에서만 쓰는 화면 코드)
}

function renderPagination(total, page) {
  // 페이지네이션 렌더링
}

// ── 페이지 동작 ──
async function loadList(page = 1) {
  currentPage = page;
  try {
    const json = await apiGet('/requests', { page, limit: LIMIT });
    // ... esc()는 utils.js에서, apiGet은 api.js에서 불러옴
    renderList(json.data);
    renderPagination(json.meta.total, json.meta.page);
  } catch (e) {
    // 에러 처리
  }
}

async function submitPost() {
  // ... 유효성 검사 후
  try {
    await apiPost('/requests', { title, content, password });
    loadList(1);
  } catch (e) {
    // 에러 처리
  }
}

// ── 이벤트 연결 ──
document.getElementById('submitBtn').addEventListener('click', submitPost);

// ── 초기 실행 ──
loadList(1);
```

### STEP 5: HTML에서 스크립트 로드 순서 설정

분리한 파일들을 HTML에서 올바른 순서로 불러옵니다.

```html
<!-- 📁 woohyun/user_request.html -->

<!-- 1단계: 공통 도구 먼저 (다른 코드가 이것들을 사용하니까) -->
<script src="../src/js/common/utils.js"></script>
<script src="../src/js/common/api.js"></script>
<script src="../src/js/common/auth.js"></script>

<!-- 2단계: UI 컴포넌트 (헤더, 푸터 등) -->
<script src="../src/js/components/header.js"></script>
<script src="../src/js/components/footer.js"></script>
<script src="../src/js/components/theme.js"></script>

<!-- 3단계: 이 페이지의 메인 로직 (위의 도구들을 사용) -->
<script src="../src/js/pages/user-request.js"></script>
```

> **로드 순서가 중요한 이유:**
> `user-request.js`에서 `esc()` 함수를 쓰려면, `utils.js`가 먼저 로드되어 있어야 합니다.
> 마치 요리할 때 재료(common) → 반찬(components) → 메인요리(pages) 순서인 것과 같습니다.

---

## 6. 한눈에 보는 Before / After 비교표

### 파일 구조 변화

| Before (현재) | After (개선) | 변화 |
|:---:|:---:|:---:|
| `src/api-config.js` | `src/js/common/api.js`에 통합 | API 설정 + 호출 함수 한 곳에 |
| `src/user_js/user_song.js`의 `esc()` | `src/js/common/utils.js` | 중복 제거 |
| `src/user_js/user_request.js`의 `esc()` | `src/js/common/utils.js` | 중복 제거 |
| `src/user_js/theme.js` | `src/js/components/theme.js` | 폴더 이동 |
| `soyu/header.js`의 theme 코드 | `src/js/components/theme.js`에 통합 | 중복 제거 |
| `src/user_js/user_header.js` | `src/js/components/header.js` (통합) | 하나의 헤더 |
| `src/user_js/user_footer.js` | `src/js/components/footer.js` | 폴더 이동 |
| `soyu/sidebar.js` | `src/js/components/sidebar.js` | 폴더 이동 |
| 관리자 3파일의 인증 코드 | `src/js/common/auth.js` | 중복 제거 |

### 코드량 변화 (예상)

| 항목 | Before | After |
|------|--------|-------|
| `esc()` 함수 | 2곳에 중복 | 1곳 (`utils.js`) |
| 인증 체크 코드 | 3곳에 중복 | 1곳 (`auth.js`) |
| API 주소 하드코딩 | 5곳 이상 | 1곳 (`api.js`) |
| 다크모드 구현 | 2벌 (localStorage + sessionStorage) | 1벌 (`theme.js`) |
| 가장 큰 파일 | 430줄 (`user_request.js`) | 약 250줄 이하 |

---

## 7. 파일 이름 짓는 규칙

### 기본 규칙

```
✅ 좋은 이름                    ❌ 피할 이름
────────────────────────────────────────────────
user-song.js                   user_song.js     (밑줄 대신 하이픈)
api.js                         apiFile.js       (불필요한 접미사)
utils.js                       utilityFunctions.js (너무 긴 이름)
pagination.js                  pagi.js          (줄임말 금지)
admin-category.js              소유_카테고리.js   (한글 금지)
```

### 폴더별 네이밍 패턴

| 폴더 | 네이밍 규칙 | 예시 |
|------|------------|------|
| `common/` | 역할 이름 (명사) | `api.js`, `utils.js`, `auth.js` |
| `components/` | UI 요소 이름 (명사) | `header.js`, `footer.js`, `pagination.js` |
| `pages/` | `영역-기능.js` 형태 | `user-song.js`, `admin-category.js` |

---

## 8. 자주 하는 실수와 해결법

### 실수 1: "파일을 너무 잘게 쪼개기"

```
❌ 이렇게는 하지 마세요:
common/
├── esc.js            ← 함수 1개짜리 파일
├── formatDate.js     ← 함수 1개짜리 파일
├── showMessage.js    ← 함수 1개짜리 파일
└── makePagBtn.js     ← 함수 1개짜리 파일
```

```
✅ 비슷한 역할끼리 묶어주세요:
common/
├── utils.js          ← esc + formatDate + showMessage 등 묶음
└── api.js            ← API 관련 함수 묶음
```

**기준:** 한 파일이 50~200줄 사이가 적당합니다. 10줄짜리 파일 20개보다 100줄짜리 파일 2개가 낫습니다.

### 실수 2: "이 함수가 어디 있는지 모르겠다"

파일 상단에 "이 파일이 뭘 하는지" 한 줄 설명을 적어두세요:

```javascript
// 📁 src/js/common/api.js
// API 서버와 통신하는 함수 모음 (GET, POST, PATCH, DELETE)

const API_BASE = 'https://api.fullstackfamily.com/api/rawbeef/v1';
// ...
```

### 실수 3: "스크립트 로드 순서 때문에 에러"

```
❌ 순서가 잘못된 경우:
<script src="pages/user-song.js"></script>   ← esc() 사용하는데
<script src="common/utils.js"></script>      ← 아직 안 불러옴!
→ "esc is not defined" 에러 발생!

✅ 올바른 순서:
<script src="common/utils.js"></script>      ← 도구 먼저
<script src="common/api.js"></script>        ← 도구 먼저
<script src="pages/user-song.js"></script>   ← 그 다음 사용
```

### 실수 4: "같은 변수 이름이 충돌"

여러 스크립트가 전역 변수를 쓰면 충돌할 수 있습니다:

```javascript
// 📁 common/api.js
const API_BASE = '...';    // 전역 변수

// 📁 pages/user-request.js
const API_BASE = '...';    // ❌ 에러! 이미 선언됨
```

**해결법:** 공통 변수는 `common/`에서만 선언하고, 페이지에서는 그냥 가져다 씁니다:

```javascript
// 📁 pages/user-request.js
// API_BASE는 api.js에서 이미 선언됨 — 여기서 다시 선언하지 않기!
const json = await apiGet('/requests', { page: 1, limit: 30 });
```

---

## 9. 체크리스트: 새 기능을 추가할 때

새로운 기능을 만들 때 아래 순서를 따라가면 파일을 어디에 놓을지 고민하지 않아도 됩니다.

### 체크리스트

```
□ 1. 새 HTML 페이지가 필요한가?
     → Yes: HTML 파일 생성 + vite.config.js에 입력 추가
     → No: 다음 단계로

□ 2. 서버에서 데이터를 가져오거나 보내는 기능이 있나?
     → Yes: common/api.js에 새 함수 추가
     → No: 다음 단계로

□ 3. 여러 페이지에서 쓸 수 있는 유틸리티 함수인가?
     → Yes: common/utils.js에 추가
     → No: 다음 단계로

□ 4. 재사용 가능한 UI 조각인가? (예: 새로운 공통 UI)
     → Yes: components/ 폴더에 새 파일 생성
     → No: 다음 단계로

□ 5. 특정 페이지에서만 쓰는 로직인가?
     → Yes: pages/ 폴더의 해당 페이지 파일에 추가
```

### 실제 예시: "이미지 업로드 기능 추가"

```
1. HTML 필요? → No (기존 admin_song.html에 추가)
2. API 호출?  → Yes → common/api.js에 apiUpload() 함수 추가
3. 유틸리티?  → Yes → common/utils.js에 validateImageSize() 추가
4. 공통 UI?   → No (관리자 페이지에서만 사용)
5. 페이지 로직? → Yes → pages/admin-song.js에 업로드 관련 코드 추가
```

---

## 부록: 나중에 ES 모듈(import/export)을 도입하면

지금은 `<script>` 태그로 파일을 불러오고 있는데, 나중에 ES 모듈을 쓰면 더 깔끔해집니다.
(이건 지금 당장 안 해도 됩니다. "이런 게 있구나" 정도만 알아두세요.)

```javascript
// 📁 src/js/common/utils.js (ES 모듈 버전)
export function esc(str) { /* ... */ }
export function formatDate(iso) { /* ... */ }

// 📁 src/js/pages/user-request.js (ES 모듈 버전)
import { esc, formatDate } from '../common/utils.js';
import { apiGet, apiPost } from '../common/api.js';

// 이제 어떤 함수가 어디서 왔는지 명확!
```

```html
<!-- HTML에서는 type="module"만 추가하면 됩니다 -->
<script type="module" src="../src/js/pages/user-request.js"></script>
<!-- 순서를 신경 쓸 필요 없음! import가 알아서 처리 -->
```

ES 모듈의 장점:
- `<script>` 로드 순서를 신경 쓸 필요 없음
- 어떤 함수가 어디서 왔는지 파일 상단에서 바로 보임
- 변수 이름 충돌 걱정 없음 (각 파일이 독립적인 스코프)

---

## 마무리

한 번에 다 바꿀 필요는 없습니다. 아래 순서로 **조금씩** 개선해보세요:

1. **1단계 (지금 바로):** `common/utils.js` 만들고 `esc()`, `formatDate()` 중복 제거
2. **2단계:** `common/api.js` 만들고 하드코딩된 API URL 한 곳으로 통합
3. **3단계:** `common/auth.js` 만들고 관리자 인증 코드 중복 제거
4. **4단계:** 나머지 파일들을 `components/`, `pages/` 폴더로 이동

매번 코드를 바꿀 때마다 "이 코드는 어떤 역할이지?" 를 한 번만 생각하면,
자연스럽게 깔끔한 구조가 만들어집니다.
