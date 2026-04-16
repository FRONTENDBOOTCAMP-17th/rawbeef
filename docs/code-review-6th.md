# 6차 코드 리뷰 — PR #52~#61 증분 리뷰

> 리뷰어: FullStackFamily 강사  
> 리뷰 일자: 2026-04-09  
> 대상 PR: #52, #53, #55, #56, #58, #59, #61

---

## 총평

노래방 번호와 앨범아트 기능이 관리자/유저 양쪽에 추가되었고, 로고 브랜딩(SW칸타빌레)과 다크모드 스타일도 개선되었습니다. 전체적인 기능 완성도가 높아졌습니다.

다만, 코드가 커지면서 **같은 코드가 여러 파일에 반복되는 문제**가 눈에 띕니다. 지금 단계에서 이 부분을 정리하면 앞으로 기능을 추가하거나 버그를 고칠 때 훨씬 수월해집니다.

해결 방법은 [6차 코드 리뷰 해결 가이드](./code-review-6th-solutions.md)에 코드 예시와 함께 정리했으니 참고해 주세요.

---

## 1. 반드시 수정해야 할 문제 (Critical)

### 1.1 `__MACOSX` 폴더가 Git에 커밋됨

**파일**: `src/user_js/font/__MACOSX/`

macOS에서 ZIP 파일을 만들면 자동으로 생기는 시스템 폴더입니다. 프로젝트와 전혀 관계없는 파일이 저장소에 들어가 있습니다.

```
src/user_js/font/__MACOSX/._Jalnan2
src/user_js/font/__MACOSX/Jalnan2/._.DS_Store
src/user_js/font/__MACOSX/Jalnan2/._Jalnan2.otf
src/user_js/font/__MACOSX/Jalnan2/._Jalnan2TTF.ttf
```

**왜 문제인가요?**
- 불필요한 파일이 저장소 용량을 차지합니다
- 다른 팀원이 보면 "이건 뭐지?" 하고 혼동합니다
- 프로젝트의 전문성이 떨어져 보입니다

**해결**: `.gitignore`에 `__MACOSX/`와 `.DS_Store`를 추가하고, 해당 폴더를 삭제합니다.

---

### 1.2 admin_song.html에 다크모드 클래스 누락

**파일**: `soyu/admin_song.html:9`

```html
<!-- 현재 (다크모드 지원 안 됨) -->
<body class="bg-gray-100 font-sans">

<!-- 다른 관리자 페이지들은 다크모드 지원함 -->
<!-- admin_category.html -->
<body class="bg-gray-100 dark:bg-gray-950 font-sans">
<!-- admin_request.html -->
<body class="bg-gray-100 dark:bg-gray-950 font-sans">
```

**왜 문제인가요?**
- 다크모드를 켜면 이 페이지만 밝은 배경으로 나옵니다
- 사용자가 페이지를 이동할 때 화면이 갑자기 바뀌어서 어색합니다

**해결**: `dark:bg-gray-950`을 추가합니다. 모달과 테이블 영역에도 다크모드 클래스를 추가해야 합니다.

---

### 1.3 인라인 `style` 속성 남용 — Tailwind 클래스로 대체 필요

**파일**: `soyu/admin_song.html:31-42`, `soyu/admin_song.js:242-287`

HTML에서:
```html
<!-- 현재: 인라인 style 사용 -->
<th class="p-4 border-r-2 border-black text-center" style="width: 5%">순위</th>
<th class="p-4 border-r-2 border-black" style="width: 10%">노래방 번호</th>
```

JS에서:
```javascript
// 현재: DOM에 직접 style 설정
tdRank.style.width = '5%';
tdSongNo.style.width = '10%';
tdArtImage.style.width = '15%';
```

**왜 문제인가요?**
- Tailwind CSS를 사용하기로 했는데, `style` 속성을 쓰면 스타일이 두 곳에 나뉘어서 관리가 어렵습니다
- Tailwind의 JIT 엔진이 인라인 스타일을 인식하지 못합니다

**해결**: Tailwind의 arbitrary value 문법을 사용합니다 → `w-[5%]`, `w-[10%]` 등

---

### 1.4 user_request.html에 CSS `<style>` 블록이 너무 많음

**파일**: `woohyun/user_request.html:10-66`

```html
<style>
  /* 장르 탭 활성 상태 */
  .str_type.on { color: #e8371b; ... }
  /* 아코디언 */
  .accordion-body { display: none; }
  .accordion-item.open .accordion-body { display: block; }
  /* 페이지네이션 */
  .pagination a.active { background-color: #dc2626; ... }
</style>
```

약 56줄의 CSS가 HTML 파일 안에 직접 작성되어 있습니다.

**왜 문제인가요?**
- CSS를 최소한으로 사용하고 Tailwind로 작성하는 것이 팀 규칙입니다
- 스타일이 HTML, Tailwind 클래스, `<style>` 블록, 3곳에 흩어져서 어디를 봐야 하는지 헷갈립니다

**해결**: 대부분 Tailwind의 variant 문법으로 대체 가능합니다. 해결 가이드에서 자세히 설명합니다.

---

## 2. 개선이 필요한 문제 (Important)

### 2.1 관리자 인증 체크 코드가 3개 파일에 동일하게 반복

**파일**: `soyu/admin_category.js:1-5`, `soyu/admin_request.js:1-5`, `soyu/admin_song.js:1-5`

세 파일 모두 이렇게 시작합니다:

```javascript
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}
```

**왜 문제인가요? (응집도와 결합도)**
- **같은 코드 3번 반복** → 나중에 로그인 페이지 경로가 바뀌면 3곳을 모두 고쳐야 합니다
- 하나라도 빠뜨리면 버그가 됩니다
- 이것을 **"낮은 응집도"**라고 합니다 — 인증이라는 하나의 관심사가 여러 파일에 흩어져 있는 것

**해결**: 공통 `auth.js` 파일을 만들어서 한 곳에서 관리합니다.

---

### 2.2 API 호출 패턴이 모든 곳에서 반복

모든 JS 파일에서 이런 패턴이 반복됩니다:

```javascript
try {
  const res = await fetch(`${API_BASE}/...`, { ... });
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

| 파일 | 이 패턴 반복 횟수 |
|------|------------------|
| `admin_category.js` | 5회 |
| `admin_request.js` | 4회 |
| `admin_song.js` | 7회 |
| `user_request.js` | 5회 |
| `user_song.js` | 2회 |
| **합계** | **23회** |

**왜 문제인가요?**
- 에러 처리 방식을 바꾸고 싶을 때 (예: `alert` → 토스트 메시지) 23곳을 모두 수정해야 합니다
- 이것을 **"높은 결합도"**라고 합니다 — 에러 처리 방식이 바뀌면 모든 파일이 영향받는 것

**해결**: 공통 `api.js` 헬퍼 함수를 만듭니다.

---

### 2.3 `renderSongs()` 함수가 120줄로 너무 큼

**파일**: `soyu/admin_song.js:230-348`

하나의 함수 안에서 이 모든 것을 처리합니다:
1. `<tr>` 요소 생성
2. 8개의 `<td>` 요소 생성 (순위, 노래방번호, 앨범아트, 제목, 가수, 카테고리, 점수, 관리)
3. 삭제 버튼 이벤트 바인딩
4. 수정 버튼 이벤트 바인딩
5. URL 목록 렌더링 + URL 삭제 이벤트 바인딩

**왜 문제인가요?**
- 함수가 너무 많은 일을 합니다 (낮은 응집도)
- 버그를 찾으려면 120줄을 처음부터 끝까지 읽어야 합니다
- 노래 행 하나만 수정하고 싶어도 전체 함수를 이해해야 합니다

**해결**: 기능별로 작은 함수로 분리합니다. 예: `createSongRow(song, index)`, `createManageButtons(song)` 등

---

### 2.4 `renderRequests()` 함수도 같은 문제

**파일**: `soyu/admin_request.js:63-164` (약 100줄)

DOM 요소 생성과 이벤트 바인딩이 하나의 거대한 함수에 모두 들어있습니다.

---

### 2.5 테마(다크모드) 저장 방식이 관리자/유저 간 다름

| 영역 | 파일 | 저장소 |
|------|------|--------|
| 관리자 | `soyu/header.js` | `sessionStorage` |
| 유저 | `src/user_js/theme.js` | `localStorage` |

**왜 문제인가요?**
- `sessionStorage`는 탭을 닫으면 사라집니다. 관리자가 다크모드를 설정해도 탭을 닫고 다시 열면 초기화됩니다
- 유저 쪽은 `localStorage`라서 설정이 유지됩니다
- 같은 기능인데 동작이 다르면 사용자가 혼란스럽습니다

**해결**: 둘 다 `localStorage`로 통일합니다.

---

### 2.6 user_footer.js가 하나의 거대한 innerHTML

**파일**: `src/user_js/user_footer.js` (97줄 전체가 하나의 문자열)

```javascript
document.getElementById('user-footer').innerHTML = `
  <footer class="...">
    ... (90줄의 HTML) ...
  </footer>
`;
```

**왜 문제인가요?**
- 전체가 하나의 문자열이라 에디터의 자동완성, 문법 검사가 작동하지 않습니다
- `style="font-family: 'Jalnan2', sans-serif;"` 인라인 스타일이 반복됩니다 (Tailwind arbitrary: `font-['Jalnan2',sans-serif]` 또는 CSS 변수 사용)

---

### 2.7 user_header.js에서 `<style>` 태그를 JS로 동적 생성

**파일**: `src/user_js/user_header.js:1-9`

```javascript
const jalnanStyle = document.createElement('style');
jalnanStyle.textContent = `
  @font-face {
    font-family: 'Jalnan2';
    src: url('../src/user_js/font/Jalnan2/Jalnan2TTF.ttf') format('truetype'),
         url('../src/user_js/font/Jalnan2/Jalnan2.otf') format('opentype');
  }
`;
document.head.appendChild(jalnanStyle);
```

**왜 문제인가요?**
- 폰트 로드는 CSS 파일에서 하는 것이 표준입니다
- JS에서 하면 JavaScript가 실행될 때까지 폰트가 로드되지 않아서 화면이 깜빡입니다 (FOUT: Flash of Unstyled Text)

**해결**: `src/style.css` 또는 별도의 `fonts.css`에 `@font-face`를 선언합니다.

---

## 3. 사소하지만 고치면 좋은 문제 (Minor)

### 3.1 `console.log`가 남아있음

**파일**: `soyu/admin_song.js:147`

```javascript
console.log('응답 데이터:', json);
```

개발 중 디버깅용 로그입니다. 배포 전에 삭제해야 합니다.

---

### 3.2 Tailwind 클래스 오류

**파일**: `soyu/admin_song.js:283`

```javascript
// gap-4와 gap-2가 동시에 있음 — 둘 중 하나만 적용됨
manageInner.className = 'flex justify-center items-center gap-4 gap-2 flex-wrap';
```

Tailwind에서 같은 속성의 클래스를 두 개 쓰면 나중에 쓴 것이 적용되는 게 아니라, CSS 파일에서의 순서에 따라 결정됩니다. 의도가 불분명합니다.

---

### 3.3 글자 수 카운터 기준 불일치

**파일**: `soyu/admin_song.js:35-39` vs `soyu/admin_song.js:71-76`

```javascript
// titleInput: 50자에서 빨간색 (maxlength도 50) ✅ 일치
el.className = count >= 50 ? 'text-sm text-red-500 ...' : 'text-sm text-gray-400 ...';

// artistInput: 20자에서 빨간색인데 maxlength는 50 ❌ 불일치
el.className = count >= 20 ? 'text-sm text-red-500 ...' : 'text-sm text-gray-400 ...';
```

가수 이름 입력란의 빨간색 전환 기준(20자)과 실제 최대 입력 글자 수(50자)가 다릅니다.

---

### 3.4 사용하지 않는 변수

**파일 1**: `soyu/admin_category.js:155`
```javascript
const categoryDeleteBtn = document.querySelectorAll('.categoryDeleteBtn');
// 선언만 하고 사용하지 않음
```

**파일 2**: `soyu/admin_category.js:165`
```javascript
const oldTitle = category[editIndex].title;
// 선언만 하고 사용하지 않음
```

불필요한 변수는 코드를 읽는 사람을 혼란스럽게 합니다.

---

### 3.5 모달 토글 코드 반복

`admin_song.js`와 `admin_category.js`에서 모달을 열고 닫을 때:

```javascript
// 열기 — 여러 곳에서 반복
modal.classList.remove('hidden');
modal.classList.add('flex');

// 닫기 — 여러 곳에서 반복
modal.classList.add('hidden');
modal.classList.remove('flex');
```

간단한 `openModal()`, `closeModal()` 함수로 만들면 됩니다.

---

## 4. 잘한 점

### 4.1 XSS 방어 유틸리티 (utils.js)
`esc()` 함수를 만들어서 유저 입력이 HTML에 삽입될 때 이스케이프 처리한 것은 보안 측면에서 좋습니다. user_song.js와 user_request.js에서 잘 활용하고 있습니다.

### 4.2 유저 페이지의 코드 구조화
`user_song.js`와 `user_request.js`에서 코드를 **렌더 함수 → 데이터 함수 → 이벤트 핸들러 → 초기 실행** 순서로 정리한 것이 좋습니다. 코드를 읽는 사람이 흐름을 파악하기 쉽습니다.

### 4.3 Tailwind 활용도 향상
이전 리뷰에서 지적된 인라인 스타일 문제가 유저 페이지에서 많이 개선되었습니다. `user_song.html`의 그리드 레이아웃, 반응형 디자인이 Tailwind로 잘 구성되었습니다.

### 4.4 앨범아트 + 노래방 번호 기능 구현
관리자에서 이미지 업로드 → 유저 화면에 표시까지 전체 흐름이 잘 작동합니다. 이미지가 없는 경우의 fallback 처리도 되어 있습니다.

### 4.5 컴포넌트 분리
`user_header.js`, `user_footer.js`, `theme.js`, `utils.js`로 공통 기능을 분리한 것이 좋습니다.

---

## 5. 우선순위 정리

| 순위 | 항목 | 난이도 | 효과 |
|------|------|--------|------|
| 1 | `__MACOSX` 폴더 삭제 + `.gitignore` 추가 | 쉬움 | 즉시 효과 |
| 2 | `admin_song.html` 다크모드 클래스 추가 | 쉬움 | UX 일관성 |
| 3 | 인라인 `style` → Tailwind 클래스로 전환 | 보통 | 유지보수 |
| 4 | 인증 코드 공통 모듈(`auth.js`)로 분리 | 보통 | 코드 중복 제거 |
| 5 | API 헬퍼 함수 공통화 | 보통 | 코드 중복 대폭 감소 |
| 6 | 큰 함수 분리 (`renderSongs` 등) | 도전 | 가독성/유지보수 |
| 7 | CSS `<style>` 블록 → Tailwind 전환 | 도전 | 팀 규칙 준수 |
