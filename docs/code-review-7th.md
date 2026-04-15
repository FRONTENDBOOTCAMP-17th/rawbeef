# 7차 코드 리뷰 — 디자인 리뉴얼 및 신규 구현 리뷰

> 리뷰 날짜: 2026-04-12
> 대상: PR #64, #66에서 리뷰 피드백 외에 새로 추가된 작업
> 범위: 디자인 전면 변경, 다크모드 확장, 헤더/사이드바 구조 변경, 페이지 이동 방식 변경

---

## 1. 이번에 새로 구현한 것들

이번 커밋에서 리뷰 피드백 반영 외에 **새로 진행한 작업**들입니다:

- 관리자 페이지 전체 디자인을 검정 테두리 스타일 → 회색/레드 톤으로 전면 교체
- `admin_song.html`, `admin_category`, `admin_request` 전체에 다크모드 클래스 추가
- 관리자 전용 `header.js` → 유저 공용 `user_header.js` + `theme.js`로 헤더 교체
- 사이드바에서 "관리자메뉴" 항목을 링크 → 텍스트(비링크)로 변경
- `admin_open.html`의 로그인 후 동작을 인라인 표시 → 페이지 이동으로 변경
- 유튜브 URL 카운트 버그 수정

---

## 2. 잘한 점

### 다크모드 일관성 개선
- 이전에는 `admin_song.html`에만 다크모드가 빠져 있었는데, 이번에 모든 관리자 페이지에 `dark:` 클래스를 추가했어요.
- 텍스트 색상(`dark:text-white`), 배경색(`dark:bg-gray-900`) 등을 체계적으로 적용한 것이 좋습니다.

### 헤더 공통화
- 관리자/유저 페이지에서 각각 다른 헤더를 쓰던 것을 `user_header.js` 하나로 통일한 것은 **결합도를 낮추는** 좋은 방향이에요.
- 테마 토글 기능도 `theme.js`로 분리되어 있어서 헤더와 테마 로직이 독립적입니다.

### 로그인 후 페이지 이동 방식 개선
- `admin_open.html`에서 로그인 성공 시 `classList` 조작으로 화면을 전환하던 방식을 `window.location.href`로 바꾼 것은 훨씬 단순하고 직관적이에요.
- 코드도 4줄 → 1줄로 줄었고, 동작도 명확합니다.

### 디자인 개선 방향
- 두꺼운 검정 테두리(`border-4 border-black`) 스타일에서 부드러운 회색/레드 톤으로 바꾼 것은 모던한 느낌을 줍니다.
- 버튼의 hover 효과도 `hover:border-red-600 hover:text-red-600`으로 일관되게 적용한 것이 좋아요.

---

## 3. 개선이 필요한 점

### 3-1. 다크모드 배경색이 페이지마다 다름 (중요도: 높음)

**현재 상태:** 각 페이지의 `<body>` 다크모드 배경색이 제각각입니다.

| 파일 | 다크모드 배경 |
|---|---|
| `admin_song.html` | `dark:bg-gray-500` |
| `admin_category.html` | `dark:bg-gray-950` |
| `admin_request.html` | `dark:bg-gray-950` |
| `admin_open.html` | `bg-gray-950` (항상 어두움) |

**문제점:**
- `admin_song.html`의 `dark:bg-gray-500`은 다크모드인데 밝은 회색이 되어 어색합니다. `gray-500`은 `#6b7280`으로 중간 밝기의 회색이에요.
- 사용자가 다크모드로 전환했을 때 페이지를 이동하면 배경색이 확 바뀌어서 어색한 경험을 줍니다.

**추천:** 모든 관리자 페이지의 `<body>`에 동일한 다크모드 배경색을 사용하세요.

```html
<!-- 모든 관리자 페이지에서 통일 -->
<body class="bg-gray-100 dark:bg-gray-950 font-sans">
```

---

### 3-2. Tailwind 클래스에 오타와 존재하지 않는 클래스 사용 (중요도: 높음)

**현재 상태:** 여러 곳에서 Tailwind에 없는 클래스나 오타가 있습니다.

**오타 1 — `text-bold`는 Tailwind에 없는 클래스**

```html
<!-- admin_song.html 35~42줄 -->
<th class="... text-xl text-bold border-b-3 ...">순위</th>
```

Tailwind에서 굵은 글씨는 `font-bold`입니다. `text-bold`는 아무 효과가 없어요.

**오타 2 — `text-gray-70`은 존재하지 않는 색상**

```html
<!-- admin_song.html 42줄 -->
<th class="p-4 text-center text-gray-70 dark:text-white ...">관리</th>
```

`text-gray-70`은 Tailwind에 없습니다. `text-gray-700`을 쓰려고 한 것 같아요.

**오타 3 — `text-gray-700mb-1`에 공백 누락**

```html
<!-- admin_song.html 57줄 -->
<label class="block font-bold text-gray-700mb-1">노래방 번호</label>
```

`text-gray-700`과 `mb-1` 사이에 공백이 없어서 두 클래스 모두 적용되지 않습니다.

---

### 3-3. `admin_song.js`와 `admin_song_main.js`에 같은 코드가 두 벌 존재 (중요도: 높음)

**현재 상태:** 파일 분리 작업을 하면서 `admin_song/` 폴더에 새 파일을 만들었지만, 기존 `admin_song.js`도 그대로 남아 있습니다.

- `soyu/admin_song.js` — 422줄 (기존 파일, 거의 원본 그대로)
- `soyu/admin_song/admin_song_api.js` — 152줄 (새 API 파일)
- `soyu/admin_song/admin_song_main.js` — 290줄 (새 메인 파일)

`admin_song.html`은 새 파일(`admin_song/admin_song_api.js`, `admin_song/admin_song_main.js`)을 로드하고 있어서, 기존 `admin_song.js`는 **아무 페이지에서도 사용되지 않는 죽은 코드**입니다.

**문제점:**
- 나중에 수정할 때 어떤 파일을 고쳐야 하는지 혼란스러워요.
- 두 벌의 코드가 다르게 발전하면 버그를 찾기 어려워집니다.

**추천:** `soyu/admin_song.js`를 삭제하세요. HTML이 이미 새 파일을 가리키고 있으니 안전합니다.

---

### 3-4. `admin_category.js`만 인증 방식이 다름 (중요도: 높음)

**현재 상태:**

```javascript
// admin_request.js, admin_song_main.js — auth.js의 함수 사용
const token = requireAuth();

// admin_category.js — 직접 토큰 체크 (옛날 방식)
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}
```

**문제점:**
- `auth.js`를 만든 이유가 바로 이 반복 코드를 없애기 위해서인데, `admin_category.js`에만 적용이 안 되었어요.
- 나중에 인증 로직을 바꿀 때(예: 토큰 만료 체크 추가) `admin_category.js`만 빠지게 됩니다.
- 이것이 바로 **"결합도는 낮추고 응집도는 높이자"**의 실제 사례입니다. 인증이라는 하나의 관심사는 `auth.js` 한 곳에 모아야 해요.

---

### 3-5. `admin_song_main.js`의 EDIT 버튼 클래스에 주석이 섞여 있음 (중요도: 높음)

**현재 상태:**

```javascript
// admin_song_main.js 109~110줄
editBtn.className =
  'border-2 border-black hover:bg-black hover:text-white → border border-gray-400 text-gray-600 hover:border-red-600 hover:text-red-600 text-lg border border-gray-400 dark:border-gray-600 px-2 py-1 text-gray-600 dark:text-gray-300 hover:border-red-600 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-400 ';
```

**문제점:**
- `border-2 border-black hover:bg-black hover:text-white → border border-gray-400` — 이 부분은 "이전 스타일 → 새 스타일" 형태의 메모인데, 그대로 className에 들어가 있어요.
- `→` 문자와 이전 스타일이 실제 클래스로 적용되려고 시도됩니다 (물론 Tailwind가 무시하지만요).
- `border`가 3번, `text-gray-600`이 2번, `hover:border-red-600`이 2번 중복됩니다.

**추천:** 필요한 클래스만 남기세요.

```javascript
editBtn.className = 'text-lg border border-gray-400 dark:border-gray-600 px-2 py-1 text-gray-600 dark:text-gray-300 hover:border-red-600 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-400';
```

---

### 3-6. JS에서 인라인 style 사용 — Tailwind 클래스로 대체 가능 (중요도: 중간)

**현재 상태:** `admin_song.js`와 `admin_song_main.js`의 `renderSongs()` 함수에서 `td` 너비를 인라인 style로 지정하고 있습니다.

```javascript
tdRank.style.width = '5%';
tdSongNo.style.width = '10%';
tdArtImage.style.width = '15%';
// ... 이런 패턴이 7번 반복
```

**문제점:**
- HTML의 `<th>`에서는 이미 Tailwind로 `w-[5%]`, `w-[10%]`을 사용하고 있는데, JS에서는 인라인 style을 쓰고 있어서 방식이 불일치해요.
- `<table>` 태그에 이미 `style="table-layout: fixed"`가 있으므로, `<th>`에서 너비를 지정하면 `<td>`는 자동으로 따라갑니다. 즉, **JS에서 `td`의 `width`를 따로 설정할 필요가 없어요.**

**추천:** `<th>`의 Tailwind `w-[...]` 클래스가 이미 있으니, JS의 `style.width` 코드를 모두 삭제하세요. `table-layout: fixed`가 `<th>`의 너비를 기준으로 자동 적용합니다.

---

### 3-7. `admin_request.html`에 옛 스타일 `border-4 border-black`이 남아 있음 (중요도: 중간)

**현재 상태:**

```html
<!-- admin_request.html 15줄 -->
<div class="flex h-[calc(100vh-57px)] w-full border-4 border-black overflow-hidden">
```

**문제점:**
- 다른 페이지들은 이미 `border-t border-gray-200` 등으로 부드러운 스타일로 바뀌었는데, `admin_request.html`만 두꺼운 검정 테두리가 남아 있어요.
- 페이지를 이동할 때 디자인 톤이 갑자기 바뀌어 어색합니다.

---

### 3-8. `renderSongs()`의 `<tr>` 스타일이 두 파일에서 다름 (중요도: 중간)

**현재 상태:**

```javascript
// admin_song.js (기존)
trCreate.className = 'border-b-2 border-black hover:bg-gray-50';

// admin_song_main.js (새 파일)
trCreate.className = ' border-b-2 border-gray-600';
```

새 파일에서는 `hover:bg-gray-50`이 빠져 있고, 다크모드 hover 효과도 없습니다.

**추천:**

```javascript
trCreate.className = 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800';
```

---

### 3-9. 모달에 다크모드 스타일 누락 (중요도: 중간)

**현재 상태:** `admin_song.html`의 모달 내부 요소들에 다크모드 스타일이 없습니다.

```html
<!-- 52줄 -->
<div class="bg-white border border-gray-200 shadow-xl p-8 w-[400px]">
  <h2 class="text-2xl font-black mb-6 uppercase">신규 노래 등록</h2>
```

**문제점:**
- 다크모드에서 모달을 열면 갑자기 하얀 배경에 검은 글씨가 나타나요.
- 페이지 본문은 어두운데 모달만 밝으면 눈이 부시고, 디자인 일관성이 깨집니다.

**추천:**

```html
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-8 w-[400px]">
  <h2 class="text-2xl font-black mb-6 uppercase dark:text-white">신규 노래 등록</h2>
```

---

### 3-10. `table-layout: fixed`에 인라인 style 사용 (중요도: 낮음)

**현재 상태:**

```html
<!-- admin_song.html 32줄 -->
<table class="w-full text-left border-collapse" style="table-layout: fixed">
```

**문제점:**
- Tailwind에는 이미 `table-fixed`라는 유틸리티 클래스가 있어요.
- CSS도 Tailwind로 쓰고 있으니 인라인 style보다 Tailwind 클래스를 쓰는 게 일관성 있습니다.

**추천:**

```html
<table class="w-full text-left border-collapse table-fixed">
```

---

### 3-11. 카테고리 드롭다운에 hover/커서 스타일 없음 (중요도: 낮음)

**현재 상태:**

```javascript
// admin_song_main.js 251줄
li.className = 'px-4 py-2 font-bold  border-gray-100 dark:text-white text-sm';
```

**문제점:**
- 마우스를 올려도 아무런 시각적 변화가 없어서, 클릭 가능한 요소인지 사용자가 알기 어려워요.
- 커서도 기본 화살표 모양이에요.

**추천:**

```javascript
li.className = 'px-4 py-2 font-bold border-gray-100 dark:text-white text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700';
```

---

## 4. 요약

| 중요도 | 항목 | 핵심 |
|---|---|---|
| 높음 | 3-1 | 다크모드 배경색 페이지마다 불일치 (`gray-500` vs `gray-950`) |
| 높음 | 3-2 | Tailwind 오타 3개 (`text-bold`, `text-gray-70`, 공백 누락) |
| 높음 | 3-3 | `admin_song.js` 죽은 코드 — 삭제 필요 |
| 높음 | 3-4 | `admin_category.js`만 `requireAuth()` 미적용 |
| 높음 | 3-5 | EDIT 버튼 className에 변경 메모(`→`)와 중복 클래스 |
| 중간 | 3-6 | JS 인라인 `style.width` → `table-layout: fixed`가 자동 처리 |
| 중간 | 3-7 | `admin_request.html`에 옛 스타일 `border-4 border-black` 잔존 |
| 중간 | 3-8 | 새 파일에서 `<tr>` hover 효과 누락 |
| 중간 | 3-9 | 모달 다크모드 스타일 누락 |
| 낮음 | 3-10 | `table-layout: fixed` → Tailwind `table-fixed` 사용 |
| 낮음 | 3-11 | 드롭다운 hover/커서 스타일 없음 |

### 응집도와 결합도 관점에서

이번 작업에서 가장 중요한 교훈은 **"바꿀 때 한 곳만 바꾸면 되게 만들자"**입니다:

- **좋은 예**: `auth.js`로 인증 로직을 한 곳에 모은 것 → 응집도 높음
- **아쉬운 예**: `admin_category.js`만 옛 방식이 남아 있는 것 → 결합도가 높아질 위험
- **좋은 예**: `theme.js`로 테마 로직을 분리한 것 → 단일 책임
- **아쉬운 예**: 다크모드 배경색이 페이지마다 다른 것 → 수정할 때 모든 파일을 확인해야 함
