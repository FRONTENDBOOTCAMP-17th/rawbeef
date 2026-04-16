6회

팀 : 박소유, 이우현

##프로젝트 구조

```
RAWBEEF/
├── .github/
├── docs/
├── node_modules/ ← 깃허브엔 안올라감 (.gitignore)
├── public/
├── src/
│ ├── admin/ ← 관리자 페이지
│ │ ├── admin_category.js
│ │ ├── admin_open.html ← 로그인 페이지
│ │ ├── admin_request.html
│ │ ├── admin_request.js
│ │ ├── admin_song.html
│ │ ├── auth.js
│ │ └── sidebar.js
│ │ └── admin_song
│ │ ├── admin_song_api.js
│ │ └── admin_song_main.js
│ ├── component/ ← 공동 컴포넌트
│ │ ├── api-config.js ← api 주소
│ │ ├── header.js
│ │ ├── theme.js
│ │ └── utils.js ← 보안
│ └── SWcantabile/ ← 사용자 페이지
│ ├── SWcantabile_footer.js
│ ├── SWcantabile_introduce_bg.js
│ ├── SWcantabile_introduce.html ← 사용자 소개 페이지
│ ├── SWcantabile_request.html
│ ├── SWcantabile_request.js
│ ├── SWcantabile_song.html
│ └── SWcantabile_song.js
├── .gitignore
├── .prettierrc.cjs
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── style.css
├── api.md
└── README.md
```
