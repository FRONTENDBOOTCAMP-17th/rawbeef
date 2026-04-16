# 7차 코드 리뷰 — 해결 가이드

> 리뷰 문서: `docs/code-review-7th.md`
> 이 문서는 리뷰에서 지적된 항목들을 **어떻게 수정하면 되는지** 코드 예시와 함께 설명합니다.

---

## 3-1 해결: 다크모드 배경색 통일하기

### 어디를 수정하나요?

`admin_song.html`의 9번째 줄입니다.

### 수정 전

```html
<body class="bg-gray-100 font-sans dark:bg-gray-500">
```

### 수정 후

```html
<body class="bg-gray-100 font-sans dark:bg-gray-950">
```

### 왜 이렇게 바꾸나요?

다른 관리자 페이지(`admin_category.html`, `admin_request.html`)에서는 이미 `dark:bg-gray-950`을 쓰고 있어요. `gray-500`은 `#6b7280`으로 다크모드라고 하기엔 너무 밝은 색입니다.

Tailwind의 gray 색상 단계를 보면:
- `gray-100`: 아주 밝음 (라이트모드 배경에 적합)
- `gray-500`: 중간 밝기 (다크모드에 쓰기엔 밝음)
- `gray-900`: 아주 어두움
- `gray-950`: 거의 검정에 가까움 (다크모드 배경에 적합)

---

## 3-2 해결: Tailwind 오타 수정하기

### 오타 1 — `text-bold` → `font-bold`

**파일:** `admin_song.html` 35~42줄

`text-bold`라는 Tailwind 클래스는 없습니다. 글씨를 굵게 하려면 `font-bold`를 써야 해요.

```
Tailwind 글씨 굵기 클래스들:
- font-thin      (100)
- font-light     (300)
- font-normal    (400)
- font-medium    (500)
- font-semibold  (600)
- font-bold      (700)   ← 이걸 써야 합니다
- font-black     (900)
```

수정 전:
```html
<th class="text-center text-gray-700 dark:text-white text-xl text-bold border-b-3 w-[5%]">순위</th>
```

수정 후:
```html
<th class="text-center text-gray-700 dark:text-white text-xl font-bold border-b-3 w-[5%]">순위</th>
```

35~42줄의 모든 `<th>`에서 `text-bold`를 `font-bold`로 바꿔주세요. 총 8개입니다.

### 오타 2 — `text-gray-70` → `text-gray-700`

**파일:** `admin_song.html` 42줄

수정 전:
```html
<th class="p-4 text-center text-gray-70 dark:text-white text-xl text-bold border-b-3 w-[20%]">관리</th>
```

수정 후:
```html
<th class="p-4 text-center text-gray-700 dark:text-white text-xl font-bold border-b-3 w-[20%]">관리</th>
```

Tailwind 색상 단계는 `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`입니다. `70`이라는 단계는 없어요.

### 오타 3 — 공백 누락 `text-gray-700mb-1`

**파일:** `admin_song.html` 57줄

수정 전:
```html
<label for="songNoInput" class="block font-bold text-gray-700mb-1">노래방 번호</label>
```

수정 후:
```html
<label for="songNoInput" class="block font-bold text-gray-700 mb-1">노래방 번호</label>
```

Tailwind 클래스는 **공백(스페이스)으로 구분**합니다. 공백이 없으면 `text-gray-700mb-1`이라는 하나의 (존재하지 않는) 클래스로 인식되어 `text-gray-700`도, `mb-1`도 적용되지 않아요.

---

## 3-3 해결: 죽은 코드 `admin_song.js` 삭제하기

### 왜 삭제해도 되나요?

`admin_song.html`의 마지막 부분을 보면:

```html
<!-- admin_song.html 95~96줄 — 현재 로드하는 파일 -->
<script src="./admin_song/admin_song_api.js"></script>
<script src="./admin_song/admin_song_main.js"></script>
```

`soyu/admin_song.js`를 `<script>`로 로드하는 HTML 파일이 하나도 없습니다. 따라서 안전하게 삭제할 수 있어요.

### 삭제 방법

터미널에서:
```bash
git rm soyu/admin_song.js
```

`git rm`은 파일을 삭제하면서 동시에 Git에게 "이 파일 삭제했어"라고 알려주는 명령어예요. 그냥 `rm`으로 삭제하면 나중에 `git add`를 따로 해야 합니다.

### 확인 방법

삭제 후 브라우저에서 `admin_song.html`을 열어보세요. 정상적으로 동작하면 성공입니다! 이 파일은 이미 새 파일들을 사용하고 있어서 영향이 없어요.

---

## 3-4 해결: `admin_category.js`에 `requireAuth()` 적용하기

### 어디를 수정하나요?

`soyu/admin_category.js`의 1~5줄입니다.

### 수정 전

```javascript
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}
```

### 수정 후

```javascript
const token = requireAuth();
```

5줄이 1줄로 줄었어요! `requireAuth()` 함수가 `auth.js`에서 이미 같은 일을 해주기 때문입니다.

### `requireAuth()`가 뭘 하는지 복습

```javascript
// auth.js
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

기존 코드와 정확히 같은 동작을 합니다. 차이점은:
- **기존**: 각 파일에서 직접 로직을 작성 (코드 반복)
- **`requireAuth()`**: 한 곳에서 관리 (변경할 때 `auth.js`만 수정하면 됨)

### 왜 이게 중요한가요?

나중에 "토큰이 만료되었으면 자동으로 재로그인시키자"라는 기능을 추가한다고 해봐요:

- **기존 방식**: `admin_song.js`, `admin_category.js`, `admin_request.js` 세 파일을 모두 찾아서 각각 수정
- **`requireAuth()` 방식**: `auth.js` 한 파일만 수정

이것이 바로 **응집도를 높이면** 유지보수가 쉬워지는 이유입니다.

---

## 3-5 해결: EDIT 버튼 className 정리하기

### 어디를 수정하나요?

`soyu/admin_song/admin_song_main.js`의 109~110줄입니다.

### 수정 전

```javascript
editBtn.className =
  'border-2 border-black hover:bg-black hover:text-white → border border-gray-400 text-gray-600 hover:border-red-600 hover:text-red-600 text-lg border border-gray-400 dark:border-gray-600 px-2 py-1 text-gray-600 dark:text-gray-300 hover:border-red-600 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-400 ';
```

### 수정 후

```javascript
editBtn.className = 'text-lg border border-gray-400 dark:border-gray-600 px-2 py-1 text-gray-600 dark:text-gray-300 hover:border-red-600 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-400';
```

### 무엇을 제거했나요?

1. `border-2 border-black hover:bg-black hover:text-white →` — 이전 스타일과 화살표 메모. className에 넣으면 안 되는 내용이에요.
2. 중복된 `border` (3개 → 1개)
3. 중복된 `text-gray-600` (2개 → 1개)
4. 중복된 `hover:border-red-600` (2개 → 1개)

### 팁: 스타일 변경 메모를 남기고 싶을 때

코드에 변경 이력을 남기고 싶으면 **주석**을 사용하세요:

```javascript
// 이전: border-2 border-black hover:bg-black hover:text-white
// 변경: 부드러운 회색/레드 톤으로 변경
editBtn.className = 'text-lg border border-gray-400 ...';
```

하지만 Git을 쓰고 있으니 커밋 메시지나 PR 설명에 적는 것이 더 좋습니다. 코드 안에 변경 이력을 남기면 오히려 코드가 지저분해져요.

---

## 3-6 해결: JS 인라인 style.width 제거하기

### 어디를 수정하나요?

`soyu/admin_song/admin_song_main.js`의 `renderSongs()` 함수 안에서 `style.width` 줄을 모두 삭제합니다.

### 수정 전

```javascript
const tdRank = document.createElement('td');
tdRank.className = ' font-bold  text-center font-bold text-gray-900 dark:text-gray-100';
tdRank.textContent = index + 1;
tdRank.style.width = '5%';    // ← 이 줄 삭제

const tdSongNo = document.createElement('td');
tdSongNo.className = '  font-bold text-center font-bold text-gray-900 dark:text-gray-100';
tdSongNo.textContent = song.songNo;
tdSongNo.style.width = '10%';  // ← 이 줄 삭제

// ... 나머지 td들도 같은 패턴
```

### 수정 후

```javascript
const tdRank = document.createElement('td');
tdRank.className = 'font-bold text-center text-gray-900 dark:text-gray-100';
tdRank.textContent = index + 1;

const tdSongNo = document.createElement('td');
tdSongNo.className = 'font-bold text-center text-gray-900 dark:text-gray-100';
tdSongNo.textContent = song.songNo;
```

### 왜 삭제해도 되나요?

HTML의 `<table>` 태그를 보면:

```html
<table class="w-full text-left border-collapse" style="table-layout: fixed">
```

`table-layout: fixed`는 **`<th>`의 너비를 기준으로 모든 `<td>`의 너비를 자동 결정**하는 CSS 속성입니다. 이미 `<th>`에 `w-[5%]`, `w-[10%]` 등이 있으니 `<td>`에 따로 너비를 지정할 필요가 없어요.

같은 김에 className의 중복 `font-bold`도 하나로 정리하면 더 깔끔합니다.

---

## 3-7 해결: `admin_request.html` 옛 스타일 제거

### 어디를 수정하나요?

`soyu/admin_request.html`의 15줄입니다.

### 수정 전

```html
<div class="flex h-[calc(100vh-57px)] w-full border-4 border-black overflow-hidden">
```

### 수정 후

```html
<div class="flex h-[calc(100vh-57px)] w-full border-t border-gray-200 dark:border-gray-700 overflow-hidden">
```

`admin_song.html`의 같은 위치를 참고하면 됩니다. 통일된 디자인을 유지하는 것이 중요해요.

---

## 3-8 해결: `<tr>` 스타일에 hover와 다크모드 추가

### 어디를 수정하나요?

`soyu/admin_song/admin_song_main.js`의 45줄입니다.

### 수정 전

```javascript
trCreate.className = ' border-b-2 border-gray-600';
```

### 수정 후

```javascript
trCreate.className = 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800';
```

### 왜 hover를 넣나요?

테이블의 행에 마우스를 올렸을 때 배경색이 살짝 바뀌면, 사용자가 **지금 어떤 행을 보고 있는지** 쉽게 알 수 있어요. 이것을 **시각적 피드백(visual feedback)**이라고 합니다.

---

## 3-9 해결: 모달에 다크모드 스타일 추가

### 어디를 수정하나요?

`soyu/admin_song.html`의 52~57줄입니다.

### 수정 전

```html
<div class="bg-white border border-gray-200 shadow-xl p-8 w-[400px]">
  <h2 id="newSong" class="text-2xl font-black mb-6 uppercase">신규 노래 등록</h2>
  <!-- ... -->
  <label for="songNoInput" class="block font-bold text-gray-700mb-1">노래방 번호</label>
  <input ... class="w-full border p-2 border-gray-400 focus:border-red-500 focus:bg-red-50 font-bold" />
```

### 수정 후

```html
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-8 w-[400px]">
  <h2 id="newSong" class="text-2xl font-black mb-6 uppercase dark:text-white">신규 노래 등록</h2>
  <!-- ... -->
  <label for="songNoInput" class="block font-bold text-gray-700 dark:text-gray-300 mb-1">노래방 번호</label>
  <input ... class="w-full border p-2 border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-red-500 focus:bg-red-50 dark:focus:bg-gray-600 font-bold" />
```

### 다크모드 클래스 추가 패턴

```
배경:   bg-white        → dark:bg-gray-800
테두리: border-gray-200 → dark:border-gray-700
글자:   text-gray-700   → dark:text-gray-300 또는 dark:text-white
입력칸: bg-white        → dark:bg-gray-700
```

모달 안의 모든 `<label>`, `<input>`, `<select>`, `<button>`에 같은 패턴으로 다크모드 클래스를 추가해주세요.

---

## 3-10 해결: 인라인 style → Tailwind 클래스

### 어디를 수정하나요?

`soyu/admin_song.html`의 32줄입니다.

### 수정 전

```html
<table class="w-full text-left border-collapse" style="table-layout: fixed">
```

### 수정 후

```html
<table class="w-full text-left border-collapse table-fixed">
```

Tailwind에 `table-fixed`라는 클래스가 있어서, 인라인 style을 쓸 필요가 없어요. 가능하면 모든 스타일을 Tailwind 클래스로 통일하는 것이 좋습니다.

---

## 3-11 해결: 드롭다운에 hover/커서 스타일 추가

### 어디를 수정하나요?

`soyu/admin_song/admin_song_main.js`의 251줄입니다.

### 수정 전

```javascript
li.className = 'px-4 py-2 font-bold  border-gray-100 dark:text-white text-sm';
```

### 수정 후

```javascript
li.className = 'px-4 py-2 font-bold border-gray-100 dark:text-white text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700';
```

### 추가한 클래스 설명

- `cursor-pointer`: 마우스를 올리면 커서가 손가락 모양으로 바뀜 → "이거 클릭할 수 있어요"라는 신호
- `hover:bg-gray-100`: 마우스를 올리면 살짝 회색 배경 → 어떤 항목 위에 있는지 알 수 있음
- `dark:hover:bg-gray-700`: 다크모드에서도 같은 효과

이렇게 **사용자가 클릭할 수 있는 요소에는 항상 hover 효과와 커서 변경**을 넣어주는 것이 좋은 습관이에요.

---

## 수정 체크리스트

수정 완료할 때마다 체크해보세요:

- [ ] 3-1: `admin_song.html` `<body>`에서 `dark:bg-gray-500` → `dark:bg-gray-950`
- [ ] 3-2: `admin_song.html`에서 `text-bold` → `font-bold` (8곳), `text-gray-70` → `text-gray-700`, `text-gray-700mb-1` → `text-gray-700 mb-1`
- [ ] 3-3: `soyu/admin_song.js` 파일 삭제 (`git rm`)
- [ ] 3-4: `admin_category.js` 1~5줄을 `const token = requireAuth();`로 교체
- [ ] 3-5: `admin_song_main.js` EDIT 버튼 className 정리
- [ ] 3-6: `admin_song_main.js`에서 `style.width` 줄 7개 삭제
- [ ] 3-7: `admin_request.html`에서 `border-4 border-black` → `border-t border-gray-200 dark:border-gray-700`
- [ ] 3-8: `admin_song_main.js`에서 `<tr>` className에 hover + 다크모드 추가
- [ ] 3-9: `admin_song.html` 모달 내부 요소에 `dark:` 클래스 추가
- [ ] 3-10: `admin_song.html`에서 `style="table-layout: fixed"` → `table-fixed` 클래스
- [ ] 3-11: `admin_song_main.js` 드롭다운 `<li>`에 `cursor-pointer hover:bg-gray-100` 추가
