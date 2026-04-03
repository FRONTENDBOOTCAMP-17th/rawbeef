# Tailwind CSS 적용 및 다크 모드 가이드

이 문서는 `woohyun/` 폴더에서 Tailwind CSS를 사용하는 방법과 다크 모드를 설정하는 방법을 설명합니다.

---

## 1. Tailwind CSS 적용하기

### 프로젝트에서 Tailwind가 동작하는 구조

```
프로젝트 루트/
├── src/
│   └── style.css          ← Tailwind 설정 파일 (이걸 HTML에서 연결)
├── vite.config.js          ← Vite 빌드 설정 + Tailwind 플러그인
└── woohyun/
    ├── user_song.html
    ├── user_song_test.html
    └── user_request.html
```

Vite가 개발 서버를 실행하거나 빌드할 때, `@tailwindcss/vite` 플러그인이 자동으로 Tailwind CSS를 처리해줍니다.

### 새 HTML 파일에 Tailwind 적용하는 방법

#### Step 1. HTML `<head>`에 CSS 연결

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>페이지 제목</title>

  <!-- Tailwind CSS 연결 (경로는 파일 위치에 따라 조정) -->
  <link rel="stylesheet" href="../src/style.css" />
</head>
```

> **주의:** CDN 방식(`<script src="https://cdn.tailwindcss.com">`)은 사용하지 않습니다.
> Vite 빌드 시스템을 통해 Tailwind를 처리하므로 CDN이 필요 없습니다.

#### Step 2. `vite.config.js`에 페이지 등록

새 HTML 파일을 만들면 `vite.config.js`의 `input`에 추가해야 빌드에 포함됩니다.

```js
// vite.config.js
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // ... 기존 페이지들 ...
        my_new_page: resolve(__dirname, 'woohyun/my_new_page.html'),  // 추가
      },
    },
  },
});
```

#### Step 3. 개발 서버에서 확인

```bash
npm run dev
```

브라우저에서 `http://localhost:5173/woohyun/my_new_page.html`로 접속하면 Tailwind 클래스가 적용된 페이지를 확인할 수 있습니다.

### CSS 연결 경로 참고

| HTML 파일 위치 | `style.css` 경로 |
|---|---|
| `woohyun/xxx.html` | `../src/style.css` |
| `soyu/xxx.html` | `../src/style.css` |
| `pages/xxx.html` | `../src/style.css` |
| `index.html` (루트) | `./src/style.css` |

---

## 2. 다크 모드 설정

### 현재 프로젝트의 다크 모드 구조

`src/style.css` 파일에 다크 모드가 **class 기반**으로 설정되어 있습니다:

```css
/* src/style.css */
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
```

이 설정의 의미:
- `<html>` 태그에 `class="dark"`가 있으면 → `dark:` 클래스가 활성화
- `class="dark"`가 없으면 → `dark:` 클래스가 무시됨 (라이트 모드)

### 다크 모드 적용 방법

#### 방법 1: 항상 다크 모드인 페이지

`<html>` 태그에 `class="dark"`를 추가하면 됩니다:

```html
<!doctype html>
<html lang="ko-KR" class="dark">
  <!-- 이 페이지는 항상 다크 모드 -->
</html>
```

#### 방법 2: 항상 라이트 모드인 페이지

`class="dark"`를 넣지 않으면 됩니다:

```html
<!doctype html>
<html lang="ko-KR">
  <!-- 이 페이지는 항상 라이트 모드 -->
</html>
```

#### 방법 3: 토글 버튼으로 전환 (user_song_test.html 방식)

JavaScript로 `<html>`의 `dark` 클래스를 추가/제거합니다:

```html
<!-- 토글 버튼 -->
<button id="themeToggle">
  <span id="themeIcon">🌙</span>
  <span id="themeLabel">다크 모드</span>
</button>

<script>
  const html = document.documentElement;
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  function applyTheme(dark) {
    if (dark) {
      html.classList.add('dark');       // 다크 모드 ON
      icon.textContent = '☀️';
      label.textContent = '라이트 모드';
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');    // 다크 모드 OFF
      icon.textContent = '🌙';
      label.textContent = '다크 모드';
      localStorage.setItem('theme', 'light');
    }
  }

  // 페이지 로드 시 저장된 설정 적용 (기본값: 다크 모드)
  applyTheme(localStorage.getItem('theme') !== 'light');

  // 버튼 클릭 시 전환
  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(!html.classList.contains('dark'));
  });
</script>
```

---

## 3. 다크 모드 클래스 사용법

Tailwind에서 `dark:` 접두사를 붙이면 다크 모드일 때만 적용되는 스타일을 지정할 수 있습니다.

### 기본 패턴: `일반스타일 dark:다크스타일`

```html
<!-- 배경색 -->
<body class="bg-white dark:bg-gray-900">

<!-- 글자색 -->
<p class="text-black dark:text-white">안녕하세요</p>

<!-- 테두리색 -->
<div class="border border-gray-200 dark:border-gray-700">
```

### 자주 쓰는 라이트/다크 색상 조합

| 용도 | 라이트 모드 | 다크 모드 | 클래스 |
|------|------------|-----------|--------|
| 페이지 배경 | `bg-white` | `dark:bg-gray-900` | `bg-white dark:bg-gray-900` |
| 카드 배경 | `bg-gray-50` | `dark:bg-gray-800` | `bg-gray-50 dark:bg-gray-800` |
| 기본 텍스트 | `text-gray-900` | `dark:text-gray-100` | `text-gray-900 dark:text-gray-100` |
| 보조 텍스트 | `text-gray-500` | `dark:text-gray-400` | `text-gray-500 dark:text-gray-400` |
| 테두리 | `border-gray-200` | `dark:border-gray-700` | `border-gray-200 dark:border-gray-700` |
| 입력 필드 배경 | `bg-white` | `dark:bg-gray-800` | `bg-white dark:bg-gray-800` |
| hover 배경 | `hover:bg-gray-100` | `dark:hover:bg-gray-700` | `hover:bg-gray-100 dark:hover:bg-gray-700` |

### 실제 예시

#### 카드 컴포넌트

```html
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
  <h2 class="text-gray-900 dark:text-white text-xl font-bold">제목</h2>
  <p class="text-gray-500 dark:text-gray-400 mt-2">설명 텍스트입니다.</p>
</div>
```

라이트 모드에서는 흰 배경에 어두운 글자, 다크 모드에서는 어두운 배경에 밝은 글자로 보입니다.

#### 버튼

```html
<button class="bg-blue-600 text-white hover:bg-blue-700
               dark:bg-blue-500 dark:hover:bg-blue-400">
  버튼
</button>
```

#### 입력 필드

```html
<input type="text"
       class="bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border border-gray-300 dark:border-gray-600
              focus:border-blue-500 dark:focus:border-blue-400
              placeholder-gray-400 dark:placeholder-gray-500
              p-2 rounded"
       placeholder="검색어 입력" />
```

### 커스텀 CSS에서 다크 모드 사용하기

`<style>` 태그 안에서 직접 CSS를 작성할 때는 `.dark` 클래스를 선택자로 사용합니다:

```css
/* 라이트 모드 (기본) */
.my-element {
  background: #ffffff;
  color: #111111;
}

/* 다크 모드 */
.dark .my-element {
  background: #1f2937;
  color: #f3f4f6;
}

/* html 태그에 직접 적용할 때 */
html.dark {
  background: #0f172a;
}
```

---

## 4. 자주 발생하는 에러와 해결법

### `Failed to load url /main.js` 에러

```
[vite] Pre-transform error: Failed to load url /main.js (resolved id: /main.js).
Does the file exist?
```

**원인:** `index.html`에서 JavaScript 파일의 경로가 잘못되어 있을 때 발생합니다.

```html
<!-- 잘못된 경로 — main.js가 루트에 없으면 에러 -->
<script type="module" src="/main.js"></script>

<!-- 올바른 경로 — src 폴더 안에 있으므로 /src/ 포함 -->
<script type="module" src="/src/main.js"></script>
```

Vite 개발 서버는 모든 HTML 엔트리 파일을 동시에 처리하기 때문에, `index.html`의 경로가 잘못되면 다른 페이지(예: `woohyun/user_song_test.html`)를 열 때도 이 에러가 반복됩니다.

**해결:** `index.html`의 `<script>` 경로를 실제 파일 위치에 맞게 수정합니다.

### Tailwind 클래스가 적용되지 않을 때

**확인할 것:**

1. `<head>`에 `<link rel="stylesheet" href="../src/style.css" />`가 있는가?
2. CDN(`<script src="https://cdn.tailwindcss.com">`)을 혹시 함께 쓰고 있지 않은가? → CDN 제거
3. `vite.config.js`의 `input`에 해당 HTML 파일이 등록되어 있는가?
4. Vite 개발 서버를 재시작해 봤는가? (`Ctrl+C` 후 `npm run dev`)

---

## 5. 체크리스트

새 페이지를 만들 때 확인할 것:

- [ ] `<head>`에 `<link rel="stylesheet" href="../src/style.css" />` 추가했는가?
- [ ] `<script src="https://cdn.tailwindcss.com">` 같은 CDN을 사용하고 있지 않은가?
- [ ] `vite.config.js`의 `input`에 새 HTML 파일을 등록했는가?
- [ ] 다크 모드가 필요한 페이지라면 `<html class="dark">`를 설정했는가?
- [ ] 다크 모드 대응이 필요한 요소에 `dark:` 클래스를 함께 작성했는가?
