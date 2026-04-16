# eightRevise 코드 리뷰

> 리뷰 범위: `8403516` (`Merge pull request #86 from FRONTENDBOOTCAMP-17th/eightRevise`)
> 리뷰 일자: 2026-04-15
> 리뷰어: FullStackFamily 강사

## 총평

소개 페이지의 분위기를 더 살리기 위해 배경 애니메이션을 분리하고, README에 프로젝트 구조를 적어두려 한 점은 좋았습니다. 다만 이번 변경에는 실제 화면 동작이 깨지는 회귀 버그가 섞여 있고, 소개 페이지 한 파일에 스타일과 로직이 너무 많이 몰리면서 응집도는 낮아지고 결합도는 높아졌습니다.

특히 이번 팀 규칙인 "CSS는 최소화하고 Tailwind를 우선 사용"이라는 기준에서 벗어난 부분이 분명히 보입니다. 아래 항목부터 우선순위대로 고치는 것을 권장합니다.

---

## 1. 반드시 먼저 고쳐야 하는 문제

### 1.1 소개 페이지에서 공통 헤더와 테마 토글이 사라졌습니다

- 위치: `src/SWcantabile/SWcantabile_introduce.html:78-81`
- 관련 파일: `src/component/header.js`, `src/component/theme.js`

현재 페이지에는 `<div id="user-header"></div>`만 있고, 실제로 헤더를 그리는 `header.js`와 다크 모드를 붙이는 `theme.js`를 불러오지 않고 있습니다.

이 상태에서는:

- 소개 페이지 상단 헤더가 비어 보입니다.
- 다른 사용자 페이지와 화면 구조가 달라집니다.
- 공통 컴포넌트를 재사용한다는 장점이 사라집니다.

이 문제는 "공통 기능을 한 곳에서 관리한다"는 구조를 깨뜨립니다. 공통 헤더를 두고도 페이지마다 직접 예외 처리하기 시작하면, 나중에 로고나 버튼을 수정할 때 모든 페이지를 다시 손봐야 합니다. 이런 상황이 바로 결합도가 높아지는 대표적인 예시입니다.

### 1.2 "실시간 점수" 섹션인데 점수 숫자가 영구적으로 숨겨집니다

- 위치: `src/SWcantabile/SWcantabile_introduce.html:247-248`, `src/SWcantabile/SWcantabile_introduce.html:304-309`

`#topSongScore` 요소에 `hidden` 클래스가 들어가 있는데, 데이터를 받아온 뒤에도 `hidden`을 제거하지 않습니다.

즉:

- API 호출이 성공해도 점수 텍스트가 화면에 보이지 않습니다.
- 사용자는 "실시간 점수" 섹션에서 가장 중요한 숫자를 볼 수 없습니다.

이번 변경 전에는 점수 막대와 숫자가 같이 보였는데, 변경 후에는 숫자 노출이 빠졌습니다. 이런 회귀 버그는 기능이 "조용히" 망가져서 더 위험합니다.

### 1.3 모바일 화면을 거의 고려하지 않은 고정 레이아웃입니다

- 위치 예시:
  - `src/SWcantabile/SWcantabile_introduce.html:86`
  - `src/SWcantabile/SWcantabile_introduce.html:115`
  - `src/SWcantabile/SWcantabile_introduce.html:137`
  - `src/SWcantabile/SWcantabile_introduce.html:215`
  - `src/SWcantabile/SWcantabile_introduce.html:263`

`px-12`, `py-40`, `grid-cols-3`, `grid-cols-2` 같은 고정값이 많이 들어가 있는데, `sm:`, `md:`, `lg:` 같은 반응형 분기가 거의 없습니다.

이렇게 작성하면:

- 작은 화면에서 좌우 여백이 너무 커집니다.
- 카드가 3열 고정이라 내용이 눌리거나 줄바꿈이 어색해집니다.
- 팀 소개와 차트 섹션이 모바일에서 답답하게 보일 가능성이 큽니다.

Tailwind를 쓰는 가장 큰 이유 중 하나가 "반응형을 클래스만으로 쉽게 관리"하는 것인데, 지금은 그 장점을 거의 활용하지 못하고 있습니다.

### 1.4 배경 캔버스가 브라우저 리사이즈 후 흐리거나 비율이 틀어질 수 있습니다

- 위치: `src/SWcantabile/SWcantabile_introduce_bg.js:5-15`, `src/SWcantabile/SWcantabile_introduce_bg.js:18-21`

캔버스는 `resize()`에서 `width`와 `height`를 다시 지정하면 내부 transform이 초기화됩니다. 그런데 현재 코드는 처음 한 번만 `ctx.scale(DPR, DPR)`를 호출하고, 이후 resize 때는 다시 scale을 적용하지 않습니다.

결과적으로:

- 창 크기를 바꾼 뒤 배경이 흐리게 보일 수 있습니다.
- 고해상도 화면에서 좌표와 실제 픽셀 크기가 어긋날 수 있습니다.

이 문제는 처음에는 멀쩡해 보여서 놓치기 쉽지만, 실제 배포 후 사용자가 창 크기를 바꾸면 바로 드러나는 버그입니다.

---

## 2. 꼭 개선하면 좋은 문제

### 2.1 소개 페이지 한 파일에 역할이 너무 많이 몰려 있습니다

- 위치:
  - 스타일: `src/SWcantabile/SWcantabile_introduce.html:9-73`
  - 데이터 로딩/애니메이션: `src/SWcantabile/SWcantabile_introduce.html:287-344`
  - 배경 효과: `src/SWcantabile/SWcantabile_introduce_bg.js`

현재 소개 페이지는 한 HTML 파일 안에 아래 역할이 같이 들어 있습니다.

- 마크업
- 인라인 CSS
- API 호출
- 스크롤 애니메이션
- 페이지 초기화

이 구조의 문제는 "파일을 열면 한 번에 너무 많은 책임을 읽어야 한다"는 점입니다.

초보 개발자일수록 책임을 분리하는 습관이 중요합니다.

- HTML: 화면 구조
- JS: 동작
- 공통 컴포넌트: 재사용 기능

이렇게 나누면 응집도는 높아지고, 다른 파일과 얽히는 정도는 낮아집니다.

### 2.2 Tailwind 프로젝트인데 일반 CSS가 너무 많습니다

- 위치: `src/SWcantabile/SWcantabile_introduce.html:9-73`

이번 팀 규칙은 "CSS는 어쩔 수 없을 때만 최소한으로 사용"입니다. 그런데 지금은 다음 스타일들이 일반 CSS로 들어가 있습니다.

- `body` 폰트
- `#bg-canvas` 위치/크기
- `.glowOrb`
- `.barFill`
- `.scrollAnim`

이 중 상당수는 Tailwind 클래스로 바로 옮길 수 있습니다. 일반 CSS가 많아질수록:

- 어떤 스타일이 어디서 적용되는지 찾기 어려워지고
- HTML과 CSS를 같이 봐야 해서 학습 난도가 올라가며
- 비슷한 클래스가 다른 페이지에 복사될 가능성도 커집니다

지금 단계에서는 "Tailwind로 가능한 것과 아닌 것을 구분하는 연습"이 중요합니다.

### 2.3 README의 프로젝트 구조 문서가 실제 구조와 다릅니다

- 위치: `README.md:5-46`

문서화 시도 자체는 좋지만, 현재 README에는 아래 문제가 있습니다.

- `##프로젝트 구조`처럼 헤더 문법이 잘못되어 있습니다.
- `src/admin/admin_song/` 트리 표현이 어색해 실제 계층처럼 보이지 않습니다.
- `style.css`가 루트에 있는 것처럼 적혀 있지만 실제 파일은 `src/style.css`입니다.

문서는 코드보다 덜 중요해 보일 수 있지만, 초보 팀일수록 README가 틀리면 새로 들어온 사람이 구조를 잘못 이해하게 됩니다.

---

## 3. 좋은 점

- `src/SWcantabile/SWcantabile_introduce_bg.js`로 배경 로직을 분리하려는 방향은 좋았습니다.
- `src/admin/sidebar.js:43-45`에서 `container`를 `sideContainer`로 바꾼 것은 변수 의미를 더 분명하게 만든 수정입니다.
- `README.md`에 프로젝트 구조를 남기려 한 시도는 팀 협업 측면에서 좋은 습관입니다.

---

## 4. 우선순위 정리

1. 소개 페이지에 공통 헤더/테마 스크립트 다시 연결
2. `topSongScore`가 실제로 보이도록 수정
3. 모바일 기준으로 레이아웃 재작성
4. 캔버스 resize 시 DPR 보정 다시 적용
5. 소개 페이지 로직 분리 및 Tailwind 중심으로 정리
6. README 구조 문서 수정

---

## 5. 한 줄 정리

이번 변경은 "디자인 강화" 방향은 좋았지만, 공통 컴포넌트 누락, 점수 숨김, 모바일 미대응 같은 기본 동작 문제가 함께 들어왔습니다. 먼저 회귀 버그를 잡고, 그 다음에 소개 페이지를 Tailwind 중심 구조로 다시 나누는 것이 가장 좋은 순서입니다.
