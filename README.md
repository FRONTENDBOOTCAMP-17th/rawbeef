6회

팀 : 박소유, 이우현

🎤 SW칸타빌레 노래방 인기 차트

노래방 TOP 10 차트 & 관리자 시스템 구축 프로젝트
Frontend Bootcamp 17th · 6조

박소유 — 관리자 페이지 · 소개 페이지
이우현 — 사용자 페이지 · 헤더/푸터 · 로고

##소개
우리가 만든 것
페이지내용사용자 소개 페이지배경 애니메이션, 스크롤 애니메이션, TOP1 실시간 표시TOP 10 차트장르 필터, 곡 검색, 유튜브 미리듣기, 앨범아트노래 등록 신청사용자 신청, 비밀번호 삭제, 관리자 답변관리자 시스템JWT 로그인, 노래/카테고리 CRUD, 신청곡 처리

스택
사용한 기술들

⚡ Vite — 빠른 개발 서버, rollupOptions 멀티 페이지 빌드
🎨 Tailwind CSS — 유틸리티 클래스, 다크모드, 반응형
📦 ES Modules — type="module", window 전역 변수로 모듈 간 공유
🌐 Fetch API — REST API GET/POST/PATCH/DELETE 직접 구현
🔑 JWT 인증 — 로그인 → 토큰 발급 → localStorage → Authorization 헤더
🛡️ XSS 방어 — utils.js esc() 함수로 사용자 입력 이스케이프

/ After ①
폴더 구조를 체계적으로 개선했다
BEFORE ❌AFTER ✅Pages/ 임시 폴더, 루트에 파일 산재src/admin/ — 관리자 전용관리자/사용자 파일 구분 없음src/SWcantabile/ — 사용자 전용공통 컴포넌트 개념 없음src/component/ — 공통 컴포넌트Vite 미설정, Tailwind 미적용Vite + Tailwind 빌드 시스템 완비

/ After ②
반복 코드를 컴포넌트로 분리했다
BEFORE ❌AFTER ✅헤더 HTML이 모든 페이지에 복붙header.js — 모든 페이지 공통 헤더사이드바가 각 admin 페이지에 직접 작성sidebar.js — 관리자 사이드바API 주소가 여러 파일에 하드코딩api-config.js — API 주소 한 곳에서 관리헤더 수정 시 모든 파일 수정 필요수정 시 한 파일만 바꾸면 전체 반영

/ After ③
admin_song.js를 역할별로 분리해 개선했다
BEFORE ❌AFTER ✅API 호출 + UI 렌더링 로직이 한 파일admin_song_api.js — API 호출만 담당500줄 이상의 단일 파일admin_song_main.js — UI 렌더링만 담당어떤 코드가 어떤 역할인지 파악 어려움각 파일의 책임이 명확해짐수정 시 전체 파일을 읽어야 함유지보수 및 디버깅이 쉬워짐

/ After ④
인증 체크를 auth.js로 통합해 개선했다
BEFORE ❌AFTER ✅URL 직접 입력 시 관리자 페이지 노출requireAuth()를 모든 admin 페이지에서 호출각 페이지마다 토큰 체크 코드 중복토큰 없으면 자동으로 로그인 페이지로 이동API는 실패하나 화면은 보임인증 로직을 한 곳에서만 수정하면 전체 반영

/ After ⑤
ES Module 로딩 순서 버그를 해결했다
BEFORE ❌AFTER ✅api-config.js가 type="module" → 지연 실행모든 <script>에 type="module" 통일인라인 script가 API_BASE 읽을 때 undefined인라인 script도 type="module"로 변경로컬에선 동작, 배포 후 404 에러window.API_BASE로 명시적 참조Vite가 일반 스크립트 경로 번들링 못함Vite가 모든 모듈을 올바르게 번들링

/ After ⑥
API 에러 처리를 모든 곳에 추가했다
BEFORE ❌
jsconst res = await fetch(url);
const json = await res.json();
renderChart(json.data);
// 서버 오류 → 아무 피드백 없음
AFTER ✅
jstry {
const res = await fetch(url);
if (!res.ok) throw new Error();
const json = await res.json();
renderChart(json.data);
} catch {
alert('서버 연결에 실패했습니다.');
}

학습 내용
프로젝트를 위해 추가로 공부한 것들

🔄 ES Module 동작 원리 — type="module"의 defer 동작, 실행 순서, window 전역 변수 관계를 직접 디버깅하며 학습
📐 Vite 멀티 페이지 설정 — rollupOptions.input으로 여러 HTML을 하나의 번들로 관리
🌙 다크모드 구현 — Tailwind dark: prefix + localStorage 연동
🎭 Canvas 애니메이션 — requestAnimationFrame, DPR(기기 픽셀비) 보정
🔐 JWT 인증 흐름 — 로그인 → 토큰 → localStorage → Authorization 헤더
🛡️ XSS 방어 — innerHTML 동적 생성 시 특수문자 이스케이프

히스토리
총 105개 PR, 8회 코드 리뷰
단계내용1~2차Vite 빌드 통합, Tailwind 다크모드, 폴더 구조 정립3차 리뷰saveCategory() 이중 호출 버그 수정, 에러 처리 추가4~5차카테고리 필터, 노래 검색, URL/이미지 API 연동6차 리뷰로그인 토큰 통합(auth.js), 다크모드, 파일 분리7차 리뷰소개 페이지 작성, 디자인 리뉴얼, 경로 정리8차 리뷰배경 애니메이션 분리, 폴더 재정리최종favicon, URL 중복 버그, ES Module 로그인 버그 수정

좋은 팀이 되기 위해 노력한 것들

📋 PR 기반 협업 — 모든 작업을 브랜치로 분리하고 PR로 머지. 총 105개 PR로 변경 내역 추적
🔍 코드 리뷰 적극 수용 — 강사 리뷰를 docs/ 폴더에 문서화하고 우선순위대로 수정
📝 API 문서화 — api.md, api-guide.md로 팀원 간 혼선 방지
🌿 브랜치 전략 운영 — develop 기반 기능 브랜치, main/develop 구분으로 안정성 유지
