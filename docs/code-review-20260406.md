# 3차 코드 리뷰 — PR #33, #34, #36, #37 (2026-04-06)

> 리뷰어: FullStackFamily 강사
> 리뷰 일자: 2026-04-06
> 대상 커밋: `a6477af` → `0efb3cc` (develop 브랜치)

---

## 총평

이번에 API 연동, 헤더/사이드바 컴포넌트화, 다크모드, Tailwind 수정까지 한꺼번에 많은 작업을 하셨습니다! 특히 API를 직접 호출해서 데이터를 CRUD하는 부분까지 진행한 것은 정말 좋은 시도입니다. 다만 **카테고리 저장 쪽에 꽤 심각한 버그**가 있어서, 이 부분은 반드시 수정이 필요합니다.

전체적으로 잘한 부분과 고쳐야 할 부분을 나눠서 정리했으니, 하나씩 천천히 살펴보세요.

---

## 잘한 점

1. **API 연동 도전** — fetch를 사용해 실제 서버와 통신하는 코드를 직접 작성했습니다. GET/POST/PATCH/DELETE 모두 사용하고 있어서 좋습니다.
2. **컴포넌트 분리 시도** — `header.js`, `sidebar.js`로 공통 UI를 분리해서 여러 페이지에서 재사용하는 구조가 좋습니다.
3. **다크모드 구현** — localStorage로 테마를 저장하고, Tailwind의 dark: 접두사를 활용한 점이 좋습니다.
4. **카테고리 드롭다운 필터** — 노래 관리 페이지에서 카테고리별 필터링을 직접 구현한 것도 좋은 시도입니다.
5. **유튜브 URL 검증** — 정규식으로 유튜브 URL 형식을 검증하는 부분이 좋습니다.

---

## 반드시 고쳐야 할 버그 (Critical)

### 1. 카테고리 저장 버튼에 `saveCategory()` 이중 호출 버그

**파일**: `soyu/admin_category.html` (저장 버튼 클릭 핸들러)

이것이 가장 심각한 버그입니다. 현재 코드를 보면:

```javascript
saveCategoryBtn.addEventListener('click', async () => {
    const titleInput = document.getElementById('titleInput');
    const title = titleInput.value;

    if (title) {
        if (editIndex !== null) {
            const oldTitle = category[editIndex].title;
            await editCategory(oldTitle, title);
            await loadCategories();
            editIndex = null;
        } else {
            await saveCategory(title);    // ← (1) 여기서 이미 저장 완료!
            await loadCategories();
        }
        renderCategory();    // ← (2) 이미 loadCategories()에서 호출되므로 불필요
        saveCategory();      // ← (3) 🚨 버그! 인자 없이 다시 호출!
        // ...
    }
});
```

**무슨 일이 생기나요?**

- `(1)`에서 `saveCategory(title)`로 카테고리를 정상 저장합니다.
- 그런데 `(3)`에서 `saveCategory()`를 **인자 없이** 또 호출합니다!
- `saveCategory` 함수는 `title` 파라미터를 받는데, 아무것도 안 넘기면 `undefined`가 들어갑니다.
- 결과: API에 `{"title": undefined}`로 POST 요청이 날아가서, **빈 카테고리가 하나 더 생기거나** API 에러가 발생합니다.

**이렇게 발생한 것 같아요**: 아마 코드를 정리하다가 if/else 밖에 있던 `saveCategory()` 호출을 지우지 않은 것 같습니다.

**수정 방법**:

```javascript
// 수정 전 (버그)
        renderCategory();
        saveCategory();      // ← 이 줄 삭제!
        modal.classList.add('hidden');

// 수정 후
        // renderCategory()도 loadCategories() 안에서 이미 호출되므로 삭제해도 됩니다
        modal.classList.add('hidden');
```

---

### 2. `/`가 포함된 카테고리명으로 API 호출 시 실패

**파일**: `soyu/admin_category.html`, `soyu/admin_song.html`

현재 카테고리에 "랩/힙합", "락/메탈", "R&B/어반" 같이 `/`가 들어간 이름이 있습니다. 그런데 코드에서 카테고리를 수정/삭제/이동할 때 **title을 URL 경로에 직접 넣고 있습니다**:

```javascript
// 현재 코드
await fetch(`https://api.fullstackfamily.com/.../categories/${title}`, { ... });
// title이 "랩/힙합"이면 URL이 이렇게 됩니다:
// .../categories/랩/힙합  ← 서버가 "랩"만 카테고리명으로 인식하고 "힙합"은 다른 경로로 해석!
```

**실제 테스트 결과**:

| 카테고리 | API 결과 |
|---------|---------|
| `POP` | 정상 동작 |
| `발라드` | 정상 동작 |
| `랩/힙합` (encodeURIComponent) | **HTTP 400 Bad Request** |
| `랩/힙합` (인코딩 없이) | **서버 에러** (경로를 잘못 해석) |

> 학생분이 코드에 "랩/힙합 처럼 / 들어간 카테고리는 필터링이 되지 않는다"고 주석을 남겨두셨는데, 정확히 이 문제입니다! `encodeURIComponent`를 써도 서버 프레임워크(Spring Boot)가 `%2F`를 `/`로 디코딩해서 경로로 해석하기 때문에 근본적으로 해결이 안 됩니다.

**수정 방법** (2가지 중 선택):

**방법 A — 카테고리명에 `/` 사용하지 않기 (가장 간단)**
- "랩/힙합" → "랩·힙합" 또는 "랩&힙합"으로 변경
- "락/메탈" → "락·메탈"
- "R&B/어반" → "R&B·어반"

**방법 B — API에 query parameter로 전달하기**
```javascript
// 수정 전
await fetch(`/api/rawbeef/v1/categories/${title}/move-up`, ...);

// 수정 후
await fetch(`/api/rawbeef/v1/categories/${encodeURIComponent(title)}/move-up`, ...);
// ⚠️ 단, 이 방법은 서버에서 %2F를 허용하도록 설정해야 합니다
// 현재 서버에서는 지원하지 않으므로 방법 A를 추천합니다
```

> 참고: 노래 관리 페이지의 카테고리 필터는 전체 곡을 받아서 JavaScript에서 `filter()`하는 방식이라 `/` 문제가 없습니다. 문제는 **URL 경로에 title을 직접 넣는 경우**에만 발생합니다.

---

### 3. 로그인 성공 후 `showSuccessScreen()` 함수 미정의

**파일**: `soyu/admin_open.html`

```javascript
if (res.ok) {
    const data = await res.json();
    localStorage.setItem(mytoken, data.data.token);
    showAdmin();
    showSuccessScreen();   // ← 🚨 이 함수가 어디에도 정의되어 있지 않습니다!
}
```

로그인은 성공하지만, `showSuccessScreen()`에서 **ReferenceError**가 발생합니다. 브라우저 개발자 도구(F12) → Console 탭에서 빨간 에러를 확인할 수 있습니다.

**수정 방법**: 이 줄을 삭제하거나, 원하는 기능을 구현하세요.

```javascript
// 수정: showSuccessScreen() 줄 삭제
if (res.ok) {
    const data = await res.json();
    localStorage.setItem(mytoken, data.data.token);
    showAdmin();
}
```

---

### 4. 노래 수정 후 목록이 갱신되지 않음

**파일**: `soyu/admin_song.html`

```javascript
saveSongBtn.addEventListener('click', async () => {
    // ...
    if (editIndex !== null) {
        await editSong(songs[editIndex].id, { ... });
        editIndex = null;
        // ← 🚨 여기서 loadSongs()를 호출하지 않음!
    } else {
        await saveSongs({ ... });
        await loadSongs();    // ← 새 곡 등록할 때는 호출함
    }
```

새 곡을 등록하면 목록이 새로고침되지만, **기존 곡을 수정하면 목록이 갱신되지 않습니다**. 수정한 내용을 보려면 페이지를 새로고침해야 합니다.

**수정 방법**:

```javascript
if (editIndex !== null) {
    await editSong(songs[editIndex].id, { ... });
    editIndex = null;
    await loadSongs();    // ← 이 줄 추가!
}
```

---

## 개선하면 좋은 점 (Important)

### 5. localStorage에는 로그인 토큰만 저장하기

현재 localStorage에 저장되는 데이터:

| 키 | 용도 | 권장 |
|----|------|------|
| `adminToken` | 로그인 JWT 토큰 | localStorage 유지 |
| `theme` | 다크/라이트 모드 | 다른 방식 권장 |

테마 설정은 `sessionStorage`나 쿠키를 사용하거나, 매번 시스템 설정(`prefers-color-scheme`)을 따르는 것이 좋습니다. localStorage는 **민감한 인증 정보 전용**으로 쓰는 것을 추천합니다.

```javascript
// 수정 전
localStorage.setItem('theme', 'dark');

// 수정 후 (방법 1: sessionStorage 사용)
sessionStorage.setItem('theme', 'dark');

// 수정 후 (방법 2: 시스템 설정 따르기)
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

---

### 6. 인증 체크 없이 관리자 페이지 접근 가능

**파일**: `soyu/admin_category.html`, `soyu/admin_song.html`

`admin_open.html`에서는 토큰이 있는지 확인하고 로그인 화면을 보여주지만, **카테고리 관리**나 **노래 관리** 페이지는 URL을 직접 입력하면 토큰 없이도 접근할 수 있습니다. API 호출은 실패하지만 페이지 자체는 보입니다.

**수정 방법** — 각 페이지 `<script>` 시작 부분에 체크를 추가하세요:

```javascript
// 페이지 로드 시 토큰 확인
const token = localStorage.getItem('adminToken');
if (!token) {
    alert('로그인이 필요합니다.');
    location.href = './admin_open.html';
}
```

---

### 7. 에러 처리가 없는 API 호출

현재 모든 API 호출에 `try-catch`가 없습니다. 네트워크 에러가 나거나 서버가 응답하지 않으면 **아무런 안내 없이** 동작이 멈춥니다.

```javascript
// 현재 코드 — 에러 시 아무 피드백 없음
const res = await fetch('https://api.fullstackfamily.com/.../categories');
const json = await res.json();

// 개선 코드
try {
    const res = await fetch('https://api.fullstackfamily.com/.../categories');
    if (!res.ok) {
        alert('카테고리를 불러오는데 실패했습니다.');
        return;
    }
    const json = await res.json();
    // ...
} catch (error) {
    alert('서버 연결에 실패했습니다. 네트워크를 확인해주세요.');
}
```

> `admin_open.html`의 로그인 부분에는 try-catch가 잘 되어 있는데, 다른 페이지에도 똑같이 적용하면 좋겠습니다!

---

### 8. sidebar.js가 일부 페이지에서 두 번 로드됨

**파일**: `soyu/admin_song.html`

```html
<div id="sidebar-container"></div>
<script src="./sidebar.js"></script>    <!-- (1) 여기서 한 번 -->
<!-- ... 중간 내용 ... -->
<script src="./sidebar.js"></script>    <!-- (2) 페이지 하단에서 또 한 번 -->
```

같은 스크립트를 두 번 로드하면 `sidebar-container`를 두 번 교체하려고 시도합니다. 첫 번째 실행에서 이미 교체되었기 때문에 두 번째는 `document.getElementById('sidebar-container')`가 `null`을 반환해서 에러가 날 수 있습니다.

**수정 방법**: `<script src="./sidebar.js"></script>`를 한 곳에만 두세요.

---

## 스타일/구조 제안 (Nice to have)

### 9. admin_category.html에서 `<main>` 태그 중복 생성

`renderCategory()` 함수에서 각 카테고리 항목마다 `<main>` 태그를 만들고 있지만, 실제로 DOM에 추가하지 않고 있어서 불필요한 코드입니다:

```javascript
const mainCreate = document.createElement('main');        // ← 만들기만 하고
mainCreate.className = 'flex-1 bg-white p-8 relative overflow-y-auto';
// ... 이후에 mainCreate를 append하는 코드가 없음
```

이 두 줄은 삭제해도 됩니다.

---

### 10. 노래 관리 페이지의 카테고리 입력이 직접 타이핑 방식

노래를 추가/수정할 때 카테고리를 **직접 타이핑**하게 되어 있습니다. 이미 카테고리 목록을 API로 가져오고 있으니, `<select>` 드롭다운으로 바꾸면 오타를 방지할 수 있습니다:

```html
<!-- 현재: 직접 타이핑 -->
<input type="text" id="categoryInput" />

<!-- 개선: 드롭다운 선택 -->
<select id="categoryInput" class="w-full border-2 border-black p-2 font-bold">
    <option value="">카테고리를 선택하세요</option>
    <!-- JavaScript로 카테고리 옵션 추가 -->
</select>
```

---

## 수정 우선순위 정리

| 순위 | 문제 | 난이도 | 예상 수정 시간 |
|------|------|--------|---------------|
| 1 | saveCategory() 이중 호출 버그 | 쉬움 (1줄 삭제) | 1분 |
| 2 | showSuccessScreen() 미정의 | 쉬움 (1줄 삭제) | 1분 |
| 3 | 노래 수정 후 목록 미갱신 | 쉬움 (1줄 추가) | 1분 |
| 4 | `/` 포함 카테고리 API 에러 | 중간 (카테고리명 변경) | 10분 |
| 5 | 인증 체크 추가 | 중간 | 10분 |
| 6 | localStorage 정리 | 쉬움 | 5분 |
| 7 | 에러 처리 추가 | 중간 | 20분 |
| 8 | sidebar.js 중복 로드 | 쉬움 (1줄 삭제) | 1분 |

> 1~3번은 1줄만 고치면 되는 버그입니다. 먼저 이것들을 고치고, 4번 이후는 시간이 될 때 하나씩 진행하세요!

---

## 부록: API 직접 테스트 결과

강사가 직접 API를 호출해서 확인한 결과입니다. **API 자체는 정상 동작합니다.**

### 카테고리 조회 (GET /categories)
```
✅ 정상 — 11개 카테고리 반환 (POP, 발라드, 트로트, 가요, 댄스, JPOP, 포크, OST, 락/메탈, 랩/힙합, R&B/어반)
```

### 카테고리 상세 조회 (GET /categories/{title})
```
✅ POP → 정상 (소속 노래 4곡 포함)
✅ 발라드 → 정상
❌ 랩/힙합 → HTTP 400 (URL 경로의 / 문제)
❌ R&B/어반 → 서버 에러 (같은 이유)
```

### 카테고리 이동 (PATCH /categories/{title}/move-up)
```
✅ POP/move-up → 정상 ("Already at the top" 응답)
❌ 랩/힙합/move-up → 실패 (같은 / 문제)
```

### 노래 조회 (GET /songs)
```
✅ 정상 — 전체 노래 목록 반환
```

### 로그인 (POST /auth/login)
```
✅ 정상 — JWT 토큰 발급 확인
```

**결론**: API는 모두 정상입니다. `/`가 포함된 카테고리명만 URL 경로 해석 문제로 실패하며, 이는 프론트엔드에서 카테고리명을 변경하면 해결됩니다.
