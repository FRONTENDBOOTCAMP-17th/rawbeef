# vite.config.js 상세 설명

## 전체 코드

```js
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
        category: resolve(__dirname, 'pages/category.html'),
        song: resolve(__dirname, 'pages/song.html'),
        admin_open: resolve(__dirname, 'soyu/admin_open.html'),
        admin_category: resolve(__dirname, 'soyu/admin_category.html'),
        admin_song: resolve(__dirname, 'soyu/admin_song.html'),
        admin_request: resolve(__dirname, 'soyu/admin_request.html'),
      },
    },
  },
});
```

---

## 1줄씩 상세 설명

### import 구문 (1~3줄)

```js
import tailwindcss from '@tailwindcss/vite';
```
- `@tailwindcss/vite`는 Tailwind CSS v4 전용 Vite 플러그인 패키지
- 이 플러그인이 HTML에서 사용한 Tailwind 클래스(`bg-gray-100`, `flex`, `text-xl` 등)를 찾아서 실제 CSS로 변환해줌
- `tailwindcss`라는 이름으로 가져옴 (default export이므로 이름은 자유롭게 지을 수 있음)

```js
import { defineConfig } from 'vite';
```
- Vite에서 제공하는 설정 도우미 함수
- `defineConfig`로 감싸면 코드 에디터에서 **자동완성**과 **타입 힌트**를 받을 수 있음
- 없어도 동작하지만, 있으면 설정 작성이 편해짐

```js
import { resolve } from 'path';
```
- Node.js 내장 모듈 `path`에서 `resolve` 함수만 꺼내옴
- `resolve`는 여러 경로 조각을 합쳐서 **절대 경로**를 만들어주는 함수
- 예: `resolve('/Users/toto/project', 'soyu/admin_open.html')` → `/Users/toto/project/soyu/admin_open.html`

---

### export default defineConfig({...}) (5줄)

```js
export default defineConfig({
```
- 이 파일 전체가 하나의 설정 객체를 내보냄
- Vite가 실행될 때 이 파일을 자동으로 읽어서 설정을 적용함
- `vite.config.js`라는 이름이면 자동 인식 (별도 지정 불필요)

---

### plugins (6줄)

```js
plugins: [tailwindcss()],
```

#### 플러그인이란?
- Vite의 기능을 확장하는 추가 도구
- 배열(`[]`)로 여러 플러그인을 등록할 수 있음

#### tailwindcss() 플러그인의 역할
이 플러그인은 다음 과정을 자동으로 처리해줌:

1. HTML 파일에서 사용된 Tailwind 클래스를 스캔
2. `src/style.css`의 `@import 'tailwindcss'`를 만나면 실제 CSS 코드로 변환
3. 사용하지 않는 클래스는 제거 (파일 크기 최적화)

```
[변환 과정 예시]

HTML에 이런 클래스가 있으면:
  <div class="flex bg-gray-100 p-6">

style.css의 @import 'tailwindcss' 가 이렇게 변환됨:
  .flex { display: flex; }
  .bg-gray-100 { background-color: rgb(243 244 246); }
  .p-6 { padding: 1.5rem; }
```

#### CDN 방식과의 차이

| | CDN (`<script src="https://cdn.tailwindcss.com">`) | Vite 플러그인 (`@tailwindcss/vite`) |
|---|---|---|
| 설치 | 필요 없음 | `npm install` 필요 |
| 속도 | 브라우저에서 매번 처리 (느림) | 빌드 시 한 번만 처리 (빠름) |
| 파일 크기 | 전체 CSS 다운로드 (~300KB) | 사용한 클래스만 포함 (~10KB) |
| 배포 | 개발용만 권장 | 실제 배포 가능 |
| 인터넷 | 필요함 | 불필요 (오프라인 동작) |

---

### build.rollupOptions.input (7~18줄)

```js
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      ...
    },
  },
},
```

#### 번들러란?

웹 프로젝트를 만들다 보면 파일이 점점 많아진다:

```
프로젝트/
├── style.css
├── sidebar.js
├── admin_open.html
├── admin_song.html
└── ...수십 개의 파일
```

브라우저가 이 파일들을 하나하나 따로 다운로드하면 느리다.
**번들러**는 이 흩어진 파일들을 **합치고, 최적화해서 적은 수의 파일로 만들어주는 도구**이다.

```
[번들러 사용 전]                    [번들러 사용 후]
style.css      ─┐
reset.css      ─┼─→ 번들러 ─→     dist/style-x7k2.css  (CSS 1개로 합침)
tailwind.css   ─┘

sidebar.js     ─┐
modal.js       ─┼─→ 번들러 ─→     dist/app-f3j1.js     (JS 1개로 합침)
validation.js  ─┘
```

번들러가 하는 일:
- **합치기**: 여러 파일을 하나로 (다운로드 횟수 줄임)
- **최적화**: 안 쓰는 코드 제거, 변수명 축약 (파일 크기 줄임)
- **변환**: Tailwind 클래스 → 실제 CSS, 최신 JS → 옛날 브라우저용 JS

대표적인 번들러: **Webpack**, **Rollup**, **esbuild**, **Parcel**

#### Rollup이란?

**Rollup**은 이런 번들러 중 하나로, Vite가 내부적으로 사용하는 번들러이다.
직접 Rollup을 설치하거나 설정할 필요는 없고, Vite가 알아서 Rollup을 사용한다.

Vite는 두 가지 모드에서 서로 다른 엔진을 사용한다:

| | 개발 서버 (`npm run dev`) | 빌드 (`npm run build`) |
|---|---|---|
| 내부 엔진 | Vite 자체 (빠른 개발용) | **Rollup** (최적화된 배포용) |
| 하는 일 | 파일을 그때그때 변환해서 브라우저에 전달 | 모든 파일을 합치고 최적화해서 `dist/` 폴더에 저장 |

#### Rollup Input이란?

Rollup Input은 **"Tailwind를 변환해주는 것" 자체가 아니다.**
**"어떤 HTML 파일을 Vite가 처리할지"를 등록하는 목록**이다.

택배 기사에게 **배달 목록**을 주는 것과 같다:

```
목록에 있는 주소  → 택배 배달함 ✅
목록에 없는 주소  → 택배 배달 안 함 ❌
```

```
input에 등록된 HTML  → Vite가 처리함 (CSS 변환, JS 번들링) ✅
input에 없는 HTML    → Vite가 무시함 (Tailwind 미적용) ❌
```

HTML이 `index.html` 1개뿐인 프로젝트라면 이 설정 자체가 필요 없다.
Vite가 자동으로 루트의 `index.html`을 처리하기 때문이다.
우리 프로젝트처럼 **HTML이 여러 개**일 때만 "이 파일들도 처리해줘"라고
rollup input에 등록하는 것이다.

input에 HTML 파일을 등록하면, Rollup이 그 HTML을 시작점으로 삼아서
안에 있는 `<link>`, `<script>` 등을 따라가며 연결된 CSS, JS를 모두 찾아서 처리한다.

```
input에 admin_open.html 등록
        │
        ▼
Vite(Rollup)가 admin_open.html을 읽음
        │
        ▼
<link rel="stylesheet" href="../src/style.css" /> 발견
        │
        ▼
src/style.css 를 읽음 → @import 'tailwindcss' 발견
        │
        ▼
@tailwindcss/vite 플러그인이 HTML에서 쓰인 클래스를 찾아 CSS로 변환
        │
        ▼
bg-gray-100, flex, p-6 등이 실제 CSS 코드로 완성됨 ✅
```

input에 등록하지 않으면 이 흐름의 **첫 번째 단계 자체가 시작되지 않는다.**

#### 결국 사용자가 해야 할 일은 간단하다

```
1. HTML에서 style.css를 연결한다
   <link rel="stylesheet" href="../src/style.css" />

2. style.css에는 @import 'tailwindcss' 한 줄만 있으면 된다

3. HTML에서 Tailwind 클래스를 그냥 쓴다
   <div class="flex bg-gray-100 p-6">

4. vite.config.js의 rollup input에 해당 HTML을 등록한다
   (HTML이 여러 개인 경우만)

→ 나머지는 Vite + @tailwindcss/vite 플러그인이 자동으로 처리해준다
```

#### 이 설정이 필요한 이유

Vite는 기본적으로 **프로젝트 루트의 `index.html` 하나만** 처리함.
하지만 우리 프로젝트는 여러 HTML 파일이 있는 **멀티 페이지 앱(MPA)**이므로,
Vite에게 "이 HTML 파일들도 처리해야 해!"라고 알려줘야 함.

#### 각 키워드 설명

- **`build`**: `npm run build` (배포용 빌드) 시 적용되는 설정
- **`rollupOptions`**: Vite 내부에서 사용하는 번들러 Rollup의 설정을 직접 지정
- **`input`**: 어떤 HTML 파일들을 진입점(entry point)으로 처리할지 목록

#### `resolve(__dirname, ...)` 설명

```js
main: resolve(__dirname, 'index.html'),
```

- **`__dirname`**: 현재 파일(vite.config.js)이 위치한 폴더의 절대 경로
  - 예: `/Users/toto/devel/edu/rawbeef`
- **`resolve(__dirname, 'index.html')`**: 두 경로를 합쳐서 절대 경로 생성
  - 결과: `/Users/toto/devel/edu/rawbeef/index.html`
- Rollup은 상대 경로가 아닌 **절대 경로**를 요구하기 때문에 `resolve`를 사용

#### input의 key(이름)는 무슨 역할인가?

```js
main: resolve(__dirname, 'index.html'),
//↑ key                   ↑ value (실제 파일 경로)
```

key(`main`, `dashboard`, `admin_open` 등)는 **빌드 결과물의 파일명**에 사용된다.

```
[빌드 전]                              [빌드 후 dist/ 폴더]
main: index.html           →          dist/index.html
dashboard: pages/dashboard.html  →    dist/pages/dashboard.html
admin_open: soyu/admin_open.html →    dist/soyu/admin_open.html
```

그리고 HTML 안에 있는 JS, CSS도 key 이름을 기반으로 결과물이 생긴다:

```
dist/
├── index.html
├── soyu/admin_open.html
└── assets/
    ├── main-x7k2f.js          ← "main" key에서 나온 JS
    ├── admin_open-f3j1.js     ← "admin_open" key에서 나온 JS
    └── style-a2b3.css         ← 공유 CSS
```

**key 이름은 자유롭게 지을 수 있다.** 단, 중복되면 안 된다:

```js
// ✅ 이렇게 해도 동작함 (이름은 자유)
홈페이지: resolve(__dirname, 'index.html'),
관리자: resolve(__dirname, 'soyu/admin_open.html'),

// ❌ key가 중복되면 에러
main: resolve(__dirname, 'index.html'),
main: resolve(__dirname, 'soyu/admin_open.html'),  // 같은 이름!
```

보통은 **파일명과 비슷하게** 짓는 것이 알아보기 쉽다.

#### 각 entry point의 의미

```js
input: {
  // key: value 형태
  // key = 빌드 결과물의 이름 (자유롭게 지정 가능)
  // value = 실제 HTML 파일의 절대 경로

  main: resolve(__dirname, 'index.html'),
  //                        └── 프로젝트 루트의 메인 페이지

  dashboard: resolve(__dirname, 'pages/dashboard.html'),
  category:  resolve(__dirname, 'pages/category.html'),
  song:      resolve(__dirname, 'pages/song.html'),
  //                              └── pages 폴더의 관리자 페이지들

  admin_open:     resolve(__dirname, 'soyu/admin_open.html'),
  admin_category: resolve(__dirname, 'soyu/admin_category.html'),
  admin_song:     resolve(__dirname, 'soyu/admin_song.html'),
  admin_request:  resolve(__dirname, 'soyu/admin_request.html'),
  //                                  └── soyu 폴더의 관리자 페이지들
}
```

---

### 개발 서버(dev) vs 빌드(build)

**`rollupOptions.input`은 `build` 안에 있는데, 개발 서버(`npm run dev`)에서도 작동하나요?**

- **개발 서버**: HTML 파일에 직접 접속하면(`http://localhost:5173/soyu/admin_open.html`) Vite가 자동으로 처리해줌. `input` 등록 없이도 동작함
- **빌드**: `npm run build`로 배포용 파일을 만들 때는 `input`에 등록된 파일만 빌드 결과물에 포함됨. 등록하지 않으면 해당 HTML이 빌드 결과에서 빠짐

→ 개발 중에는 CDN이든 뭐든 일단 되지만, **빌드/배포를 위해 등록이 필수**

#### HTML 파일을 새로 만들면 매번 등록해야 하나요?

| 상황 | rollup input 등록 필요? |
|---|---|
| 개발 중 (`npm run dev`) | 불필요 — 브라우저에서 URL로 직접 접속하면 Vite가 알아서 처리 |
| 배포 빌드 (`npm run build`) | **필요** — 등록하지 않은 HTML은 빌드 결과에서 빠짐 |

그래서 HTML 파일을 새로 만들면 **바로 rollup input에도 추가하는 습관**을 들이는 게 좋다.
나중에 빌드할 때 "왜 이 페이지가 안 나오지?"라는 문제를 예방할 수 있다.

```js
// 예: soyu/admin_stats.html 파일을 새로 만들었다면
input: {
  // ...기존 항목들...
  admin_stats: resolve(__dirname, 'soyu/admin_stats.html'),  // ← 새로 추가
}
```

---

### 프로젝트 폴더 구조와 entry point 매핑

```
rawbeef/
├── index.html                  ← main
├── vite.config.js              ← 이 설정 파일
├── src/
│   └── style.css               ← @import 'tailwindcss' (모든 HTML이 공유)
├── pages/
│   ├── dashboard.html          ← dashboard
│   ├── category.html           ← category
│   └── song.html               ← song
└── soyu/
    ├── admin_open.html          ← admin_open
    ├── admin_category.html      ← admin_category
    ├── admin_song.html          ← admin_song
    ├── admin_request.html       ← admin_request
    └── sidebar.js               ← 사이드바 컴포넌트 (entry point 아님, HTML에서 <script>로 로드)
```

---

## PR #15에서 원래 작성했던 코드가 안 되었던 이유

```js
// ❌ PR 원본 코드 (에러 발생)
index: path.resolve(__dirname, 'index.html'),
...findAllHtmlFiles(path.resolve(__dirname, 'src')),
...findAllHtmlFiles(path.resolve(__dirname, 'soyu')),
```

### 문제 1: `path.resolve` 사용
```js
import { resolve } from 'path';   // ← resolve만 꺼냄, path 객체 자체는 없음

path.resolve(...)   // ❌ path는 undefined → TypeError
resolve(...)        // ✅ 이렇게 써야 함
```

`import path from 'path'`로 가져왔다면 `path.resolve()`가 가능하지만,
`import { resolve } from 'path'`로 가져왔으므로 `resolve()`만 사용 가능.

### 문제 2: `findAllHtmlFiles` 함수 미정의
```js
findAllHtmlFiles(...)  // ❌ 이 함수가 어디에도 정의되어 있지 않음
```

이 함수를 쓰려면 직접 만들어야 했음:
```js
// 이런 함수를 만들어야 했지만, 그냥 명시적으로 나열하는 것이 더 간단함
import { readdirSync } from 'fs';
function findAllHtmlFiles(dir) { ... }
```

### 수정된 코드
```js
// ✅ 수정본 - 각 파일을 명시적으로 나열
admin_open: resolve(__dirname, 'soyu/admin_open.html'),
admin_category: resolve(__dirname, 'soyu/admin_category.html'),
admin_song: resolve(__dirname, 'soyu/admin_song.html'),
admin_request: resolve(__dirname, 'soyu/admin_request.html'),
```

파일이 4개뿐이므로 직접 나열하는 것이 가장 명확하고 안전한 방법.
