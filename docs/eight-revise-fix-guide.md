# eightRevise 수정 가이드

> 대상 독자: HTML, CSS, Tailwind CSS, JavaScript를 막 배우기 시작한 팀원
> 목적: 이번 리뷰에서 나온 문제를 "왜 고쳐야 하는지"와 "어떻게 고치는지"를 쉽게 설명

## 먼저 기억할 원칙 3가지

### 1. 공통 기능은 공통 파일을 재사용한다

헤더, 테마 토글, 사이드바처럼 모든 페이지에서 비슷하게 쓰는 기능은 각 페이지에서 따로 만들지 말고 공통 파일을 연결해야 합니다.

이렇게 해야:

- 한 번 고치면 여러 페이지가 같이 좋아지고
- 같은 코드를 여러 번 복사하지 않아도 되고
- 결합도가 낮아집니다

### 2. HTML은 구조, JavaScript는 동작을 맡긴다

HTML 파일 안에 스크립트가 너무 많아지면 나중에 찾기 어렵습니다.

- HTML: 뼈대
- Tailwind: 꾸미기
- JavaScript: 데이터 불러오기, 이벤트, 애니메이션

이렇게 역할을 나누면 응집도가 높아집니다.

### 3. Tailwind로 가능한 것은 Tailwind로 작성한다

`class=""` 안에서 해결 가능한 스타일을 굳이 `<style>`로 빼지 않는 것이 좋습니다.

---

## 1. 소개 페이지에 공통 헤더와 테마 토글 다시 붙이기

### 왜 문제인가

`<div id="user-header"></div>`만 두고 `header.js`, `theme.js`를 불러오지 않으면 화면 상단이 비어 보입니다.

### 어떻게 고치나

`src/SWcantabile/SWcantabile_introduce.html` 상단에서 아래 순서로 다시 연결합니다.

```html
<div id="user-header"></div>
<script src="../component/header.js"></script>
<script src="../component/theme.js"></script>
<script src="../component/api-config.js"></script>
<script src="./SWcantabile_introduce_bg.js"></script>
```

### 왜 이 순서가 좋은가

- `header.js`가 먼저 헤더를 만듭니다.
- `theme.js`는 그 안에 있는 토글 버튼을 찾아서 이벤트를 연결합니다.
- `api-config.js`는 이후 API 호출에서 사용합니다.

즉, "만들고 나서 연결한다"는 순서입니다.

---

## 2. 점수 숫자가 실제로 보이게 만들기

### 왜 문제인가

지금은 `topSongScore`에 `hidden`이 붙어 있어서, 자바스크립트가 텍스트를 넣어도 화면에 안 보입니다.

### 가장 쉬운 해결 방법

아예 `hidden` 클래스를 제거합니다.

```html
<span id="topSongScore" class="font-mono text-[13px] text-violet-400 shrink-0"></span>
```

### 만약 로딩 전에는 숨기고 싶다면

데이터를 성공적으로 불러온 뒤 `hidden`을 제거합니다.

```js
const scoreEl = document.getElementById('topSongScore');

scoreEl.textContent = `${Number(top.score).toLocaleString()}점`;
scoreEl.classList.remove('hidden');
```

### 초보자 팁

"텍스트를 넣었다"와 "화면에 보인다"는 다른 문제입니다.  
화면에 보이지 않을 때는 먼저 `hidden`, `opacity-0`, `display: none` 같은 숨김 스타일이 있는지 확인하세요.

---

## 3. 모바일 우선으로 레이아웃 바꾸기

### 왜 문제인가

`grid-cols-3`, `grid-cols-2`, `px-12`를 기본값으로 주면 작은 화면에서도 그대로 적용됩니다. 모바일에서는 너무 빡빡해집니다.

### 좋은 Tailwind 습관

기본은 모바일로 쓰고, 화면이 커질 때만 `md:`, `lg:`를 붙입니다.

### 예시 1. 통계 섹션

기존:

```html
<div class="grid grid-cols-3 border-t border-b border-zinc-800 relative z-10">
```

권장:

```html
<div class="relative z-10 grid grid-cols-1 border-y border-zinc-800 sm:grid-cols-3">
```

### 예시 2. 기능 카드 섹션

기존:

```html
<div class="grid grid-cols-3 rounded-2xl mt-12 border border-zinc-800 overflow-hidden">
```

권장:

```html
<div class="mt-12 grid grid-cols-1 overflow-hidden rounded-2xl border border-zinc-800 md:grid-cols-2 xl:grid-cols-3">
```

### 예시 3. 전체 여백

기존:

```html
<section class="relative text-center px-12 pt-28 pb-20 overflow-hidden">
```

권장:

```html
<section class="relative overflow-hidden px-4 pt-20 pb-16 text-center sm:px-6 lg:px-12 lg:pt-28 lg:pb-20">
```

### 핵심 요령

- 모바일 기본: `grid-cols-1`, `px-4`
- 태블릿: `md:grid-cols-2`
- 데스크톱: `lg:grid-cols-3`, `lg:px-12`

이 패턴만 익혀도 화면이 훨씬 안정적입니다.

---

## 4. 캔버스 resize 버그 고치기

### 왜 문제인가

캔버스는 `width`, `height`를 다시 넣는 순간 내부 설정이 초기화됩니다. 그래서 resize 후에도 선명하게 보이게 하려면 `setTransform` 또는 `scale`을 다시 적용해야 합니다.

### 추천 코드

```js
(function () {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0;
  let H = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;

    cv.width = W * DPR;
    cv.height = H * DPR;
    cv.style.width = `${W}px`;
    cv.style.height = `${H}px`;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);
})();
```

### 여기서 중요한 점

- `if (!cv) return;`
  페이지에 캔버스가 없으면 조용히 종료합니다.
- `ctx.setTransform(...)`
  resize 후에도 DPR 보정이 유지됩니다.

이 한 줄이 있느냐 없느냐에 따라 화면 품질이 달라집니다.

---

## 5. 소개 페이지 역할 나누기

### 왜 문제인가

지금 소개 페이지는 한 파일이 너무 많은 일을 하고 있습니다.

- 마크업
- 스크롤 애니메이션
- API 호출
- 배경 효과
- 스타일 정의

이렇게 되면 파일을 수정할 때 "어디를 건드려야 하는지" 찾는 데 시간이 많이 듭니다.

### 추천 구조

```text
src/SWcantabile/
├── SWcantabile_introduce.html
├── SWcantabile_introduce.js
├── SWcantabile_introduce_bg.js
└── SWcantabile_footer.js
```

### 각 파일 역할

- `SWcantabile_introduce.html`
  화면 구조와 Tailwind 클래스만 작성
- `SWcantabile_introduce.js`
  API 호출, IntersectionObserver, 화면 초기화
- `SWcantabile_introduce_bg.js`
  캔버스 배경 효과만 담당

### 왜 이게 응집도가 높은가

한 파일이 한 가지 역할에 집중하기 때문입니다.

- 배경 문제가 생기면 `SWcantabile_introduce_bg.js`
- 데이터 문제가 생기면 `SWcantabile_introduce.js`
- 레이아웃 문제가 생기면 HTML

찾기 쉬워지고 수정도 쉬워집니다.

---

## 6. Tailwind로 옮길 수 있는 CSS 먼저 줄이기

### 지금 CSS로 작성된 것 중 Tailwind로 옮기기 쉬운 것

#### 캔버스

기존 CSS:

```css
#bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
```

Tailwind:

```html
<canvas id="bg-canvas" class="pointer-events-none fixed inset-0 z-0 h-full w-full"></canvas>
```

#### 오브

기존 CSS:

```css
.glowOrb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}
```

Tailwind:

```html
<div class="pointer-events-none absolute left-1/2 -top-35 h-140 w-140 -translate-x-1/2 rounded-full bg-violet-500/6 blur-[90px]"></div>
```

#### 스크롤 애니메이션 기본값

Tailwind만으로도 어느 정도 표현할 수 있습니다.

```html
<div class="translate-y-5 opacity-0 transition duration-700"></div>
```

### CSS를 남겨도 되는 경우

- `body::before` 같은 가상 요소
- 캔버스 내부 그리기 로직
- Tailwind로 쓰면 오히려 더 복잡해지는 아주 특수한 스타일

즉, "무조건 CSS 금지"가 아니라 "Tailwind로 되는 건 Tailwind로 먼저"가 핵심입니다.

---

## 7. README 문서도 같이 정리하기

### 왜 필요한가

문서가 실제 폴더 구조와 다르면 팀원이 잘못 이해합니다.

### 체크할 것

1. 제목 문법: `## 프로젝트 구조`
2. 실제 파일 위치와 README가 같은지 확인
3. 트리 들여쓰기가 실제 폴더 구조처럼 보이는지 확인

### 예시

```md
## 프로젝트 구조

src/
├── admin/
│   ├── admin_song.html
│   ├── sidebar.js
│   └── admin_song/
│       ├── admin_song_api.js
│       └── admin_song_main.js
├── component/
│   ├── api-config.js
│   ├── header.js
│   ├── theme.js
│   └── utils.js
└── SWcantabile/
    ├── SWcantabile_introduce.html
    ├── SWcantabile_introduce.js
    ├── SWcantabile_introduce_bg.js
    └── SWcantabile_song.html
```

---

## 추천 수정 순서

1. 헤더/테마 복구
2. 점수 숫자 표시 복구
3. 모바일 레이아웃 정리
4. 캔버스 resize 수정
5. 소개 페이지 로직 분리
6. README 정리

이 순서가 좋은 이유는 "보이는 버그"부터 먼저 잡고, 그 다음에 구조를 개선할 수 있기 때문입니다.

---

## 마지막 정리

이번 수정에서 가장 중요한 공부 포인트는 3가지입니다.

1. 공통 기능은 공통 파일로 재사용하기
2. 모바일을 기본으로 Tailwind 반응형 클래스 쓰기
3. 한 파일에 너무 많은 역할을 넣지 않기

이 세 가지만 지켜도 초보 개발자의 코드가 훨씬 읽기 쉬워지고, 고치기 쉬워집니다.
