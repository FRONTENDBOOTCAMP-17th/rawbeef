# 2026-04-16 코드 리뷰 해결 가이드

> 대상 독자: HTML, CSS, Tailwind CSS, JavaScript를 배우는 초보 개발자
> 목적: 이번 리뷰에서 나온 문제를 왜 고쳐야 하는지, 어떻게 고치면 되는지 쉽게 설명

## 먼저 기억할 핵심 개념 2가지

### 1. 응집도는 "한 파일이 한 가지 역할에 집중하는 정도"입니다

예를 들어:

- `introduce.html`은 화면 구조
- `introduce.js`는 데이터와 이벤트
- `introduce_bg.js`는 배경 효과

이렇게 나누면 파일을 읽기 쉬워지고, 수정 위치도 빨리 찾을 수 있습니다. 이것이 응집도가 높은 구조입니다.

### 2. 결합도는 "파일끼리 얼마나 강하게 얽혀 있는지"입니다

예를 들어 소개 페이지만 공통 헤더를 안 쓰기 시작하면:

- 헤더를 고칠 때 소개 페이지를 따로 또 봐야 하고
- 페이지별 예외가 생기고
- 수정 비용이 커집니다

이것이 결합도가 높아지는 상황입니다.

좋은 구조는:

- 한 파일은 자기 역할에 집중하고
- 공통 기능은 공통 파일을 재사용하는 구조입니다

---

## 1. `theme.js`는 DOM이 준비된 뒤, 또는 요소가 있는지 확인한 뒤 실행하세요

### 왜 문제인가

지금 `theme.js`는 실행되자마자 `themeIcon`, `themeLabel`에 바로 접근합니다.

그런데 소개 페이지에서는:

- 스크립트가 `<head>`에서 먼저 실행되고
- 토글 버튼 요소는 아직 없고
- 공통 헤더도 연결되지 않았습니다

그래서 `null.textContent` 같은 오류가 날 수 있습니다.

### 가장 좋은 해결 방법

1. 소개 페이지에 공통 헤더를 다시 연결합니다.
2. `header.js` 다음에 `theme.js`를 불러옵니다.
3. `theme.js` 자체도 요소가 없을 수 있다는 상황을 대비합니다.

### 추천 예시 1. 소개 페이지 스크립트 순서

```html
<body>
  <div id="user-header"></div>

  ...

  <script src="../component/header.js"></script>
  <script src="../component/theme.js"></script>
  <script src="../component/api-config.js"></script>
  <script src="./SWcantabile_introduce.js"></script>
  <script src="./SWcantabile_introduce_bg.js"></script>
</body>
```

### 추천 예시 2. `theme.js`를 안전하게 만들기

```js
const html = document.documentElement;
const btn = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');
const label = document.getElementById('themeLabel');

function applyTheme(dark, save = false) {
  html.classList.toggle('dark', dark);

  if (icon) {
    icon.textContent = dark ? '☀️' : '🌙';
  }

  if (label) {
    label.textContent = dark ? '라이트 모드' : '다크 모드';
  }

  if (save) {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
}
```

### 왜 두 가지를 같이 해야 하나

- HTML에서는 공통 구조를 다시 살리고
- JS에서는 예외 상황에도 안 깨지게 만들어야 합니다

한쪽만 하면 또 다른 페이지에서 비슷한 문제가 반복될 수 있습니다.

---

## 2. 점수 숫자는 "텍스트를 넣는 것"과 "보이게 만드는 것"을 같이 처리하세요

### 왜 문제인가

`topSongScore`에는 `hidden` 클래스가 있는데, 자바스크립트는 텍스트만 넣고 있습니다.

즉:

- 데이터는 들어가지만
- 화면에는 안 보입니다

### 가장 쉬운 해결 방법

아예 HTML에서 `hidden`을 지웁니다.

```html
<span id="topSongScore" class="font-mono text-[13px] text-violet-400 shrink-0"></span>
```

### 만약 로딩 전에는 숨기고 싶다면

데이터를 채운 뒤 `hidden`을 제거합니다.

```js
const scoreEl = document.getElementById('topSongScore');

scoreEl.textContent = `${Number(top.score).toLocaleString()}점`;
scoreEl.classList.remove('hidden');
```

### 초보자 팁

화면에 안 보이면 먼저 아래를 확인하세요.

- `hidden`
- `opacity-0`
- `display: none`
- 부모 요소가 `hidden`인지

---

## 3. 관리자 화면에서는 "성공했을 때만 성공 알림"을 보여주세요

### 왜 문제인가

사용자는 팝업 문구를 믿습니다.  
실패했는데도 "등록 완료", "수정 완료"가 뜨면 가장 위험한 종류의 버그가 됩니다.

### 지금 구조에서 고치는 방법

반환값을 변수에 담고, 성공했는지 먼저 검사합니다.

```js
if (editIndex !== null) {
  const updated = await editCategory(category[editIndex].id, title);
  if (!updated) return;

  await loadCategories();
  editIndex = null;
  alert('카테고리 수정이 완료되었습니다!');
} else {
  const created = await saveCategory(title);
  if (!created) return;

  await loadCategories();
  alert('카테고리 등록이 완료되었습니다!');
}
```

### 삭제도 같은 방식으로 고칩니다

```js
const res = await fetch(`${API_BASE}/categories/${id}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});

if (!res.ok) {
  alert('카테고리 삭제에 실패했습니다.');
  return;
}

alert('카테고리 삭제가 완료되었습니다!');
await loadCategories();
```

### 여기서 배워야 할 포인트

- `fetch()`가 실행됐다고 성공이 아닙니다
- `res.ok`까지 확인해야 성공입니다
- 성공 메시지는 성공 검사가 끝난 뒤에만 띄웁니다

---

## 4. 공통 헤더는 페이지마다 빼지 말고 재사용하세요

### 왜 중요한가

공통 헤더는 로고, 테마 토글, 이동 경로 같은 공통 기능을 담는 영역입니다.

소개 페이지만 헤더를 안 쓰게 되면:

- 소개 페이지만 예외가 생기고
- 수정할 때 빠뜨릴 확률이 커지고
- 구조 이해가 어려워집니다

### 권장 구조

```html
<div id="user-header"></div>
```

```html
<script src="../component/header.js"></script>
<script src="../component/theme.js"></script>
```

이렇게 두면 헤더 수정은 `header.js` 한 곳만 보면 됩니다.

이것이 결합도를 낮추는 방법입니다.

---

## 5. 푸터에서는 문법에 맞는 HTML 구조를 지키세요

### 왜 문제인가

`<p>` 안에 다시 `<p>`를 넣으면 브라우저가 자동으로 구조를 바꿔 버릴 수 있습니다.  
그러면 개발자가 생각한 레이아웃과 실제 DOM 구조가 달라질 수 있습니다.

### 안전한 방법

문단끼리는 `p`, 그룹은 `div`로 나누세요.

```html
<div class="...">
  <p class="...">
    <span>제작자 : 박소유, 이우현</span>
    <span>mogoa97@naver.com</span>
    <span>연락처 : 010-7774-0699</span>
  </p>

  <div class="...">
    <span>도움을 주신 분 : 김성박 강사님</span>
    <p class="text-gray-500 dark:text-gray-600 text-[11px] xl:text-xs m-0 mt-4">
      Copyrightⓒ 2026 SW cantabile All Rights Reserved.
    </p>
  </div>
</div>
```

### 초보자 기준으로 기억할 규칙

- `p`는 문단
- `div`는 묶음
- 문단 안에 또 다른 문단을 넣지 않는다

---

## 6. Tailwind로 가능한 것은 먼저 Tailwind로 옮기세요

### 왜 이 원칙이 중요한가

이번 팀 규칙은 "CSS는 어쩔 수 없을 때만 최소한으로"입니다.

Tailwind를 쓰면 좋은 점은:

- HTML에서 바로 스타일을 읽을 수 있고
- 파일을 왔다 갔다 하지 않아도 되고
- 공통 규칙을 지키기 쉽습니다

### 소개 페이지에서 나눠서 생각하기

#### Tailwind로 옮기기 쉬운 것

- 여백
- 배치
- 위치
- 색상
- 투명도
- 반응형 처리

#### CSS로 남겨도 되는 것

- `::after`
- 매우 특수한 애니메이션
- Tailwind로 표현하기 너무 복잡한 경우

### 예시

기존 CSS 대신:

```html
<canvas id="bg-canvas" class="fixed inset-0 h-full w-full pointer-events-none z-0"></canvas>
```

이런 식으로 최대한 클래스에서 해결하는 습관이 좋습니다.

### 실전 기준

스타일을 추가할 때마다 먼저 스스로에게 물어보세요.

1. 이건 Tailwind 클래스로 되나?
2. 된다면 CSS로 빼지 말자
3. 안 될 때만 최소한의 CSS를 추가하자

---

## 7. 추천 수정 순서

1. 소개 페이지에 공통 헤더와 `theme.js` 순서를 바로잡기
2. `topSongScore`가 보이도록 수정
3. 관리자 카테고리 성공/실패 처리 수정
4. 푸터 HTML 구조 수정
5. 소개 페이지 인라인 CSS를 Tailwind 우선 구조로 추가 정리

---

## 마지막 정리

좋은 프론트엔드 코드는 "화면이 예쁜 코드"보다 "안전하게 동작하고, 읽기 쉽고, 공통 구조를 잘 재사용하는 코드"에 더 가깝습니다.

이번 변경은 방향은 좋았습니다. 이제는 그 위에:

- 공통 컴포넌트 재사용
- 성공/실패 상태를 정확히 표현
- Tailwind 우선 작성
- 역할 분리

이 네 가지를 더 올리면 훨씬 안정적인 코드가 됩니다.
