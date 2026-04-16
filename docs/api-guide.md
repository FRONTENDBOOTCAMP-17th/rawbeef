# RawBeef API 사용 가이드

> FullStackFamily에서 제공하는 노래방 점수 관리 프로젝트용 백엔드 API
> 명세서 리뷰를 반영하여 구현 완료 (2026-04-03)

---

## Base URL

```
https://api.fullstackfamily.com/api/rawbeef/v1
```

## 관리자 계정

| username | password |
|----------|----------|
| admin | 8888 |

> 로그인 시 비밀번호만 보내면 됩니다: `{"password": "8888"}`

---

## API 목록 (19개)

### Auth (1개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| POST | `/auth/login` | X | 관리자 로그인 |

### Categories (7개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/categories` | X | 카테고리 목록 |
| GET | `/categories/{title}` | X | 카테고리 상세 (노래 포함) |
| POST | `/categories` | O | 카테고리 추가 |
| PATCH | `/categories/{title}` | O | 카테고리 수정 |
| PATCH | `/categories/{title}/move-up` | O | 위로 이동 |
| PATCH | `/categories/{title}/move-down` | O | 아래로 이동 |
| DELETE | `/categories/{title}` | O | 카테고리 삭제 |

> 카테고리 이름이 PK입니다. URL에 한글 사용 시 자동 인코딩됩니다.

### Songs (5개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/songs?category=` | X | 노래 목록 |
| GET | `/songs/{id}` | X | 노래 상세 |
| POST | `/songs` | O | 노래 등록 |
| PATCH | `/songs/{id}` | O | 노래 수정 |
| DELETE | `/songs/{id}` | O | 노래 삭제 |

### Requests - 노래 신청 (3개, 비로그인)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/requests?page=&limit=&search=` | X | 신청 목록 |
| POST | `/requests` | X | 신청 등록 (글 비밀번호) |
| POST | `/requests/{id}/delete` | X | 신청 삭제 (비밀번호 확인) |

### Comments - 댓글 (2개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| POST | `/requests/{id}/comments` | X | 댓글 등록 |
| DELETE | `/requests/comments/{commentId}` | O | 댓글 삭제 (관리자) |

---

## 사용 예시

### 로그인

```javascript
const res = await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: "8888" })
});
const { data } = await res.json();
const token = data.token;
```

### 카테고리 관리

```javascript
// 목록 조회
const categories = await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/categories").then(r => r.json());

// 상세 (해당 카테고리 노래 포함)
const detail = await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/categories/발라드").then(r => r.json());

// 추가
await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/categories", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ title: "트로트" })
});

// 이름 수정
await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/categories/트로트", {
  method: "PATCH",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ title: "트로트곡" })
});

// 순서 변경 (아래로)
await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/categories/발라드/move-down", {
  method: "PATCH",
  headers: { Authorization: `Bearer ${token}` }
});
```

### 노래 관리

```javascript
// 카테고리별 목록
const songs = await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/songs?category=발라드").then(r => r.json());

// 등록
await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/songs", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    category: "발라드",
    title: "밤편지",
    artist: "아이유",
    score: 97,
    url: "https://youtube.com/watch?v=..."
  })
});
```

### 노래 신청 (비로그인)

```javascript
// 신청 등록
await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/requests", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "밤편지 신청",
    content: "아이유 밤편지 추가해주세요",
    password: "1234"
  })
});

// 신청 삭제 (글 비밀번호)
await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/requests/1/delete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: "1234" })
});

// 댓글 등록
await fetch("https://api.fullstackfamily.com/api/rawbeef/v1/requests/1/comments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content: "좋은 선곡이네요!" })
});
```

---

## Seed 데이터

| 카테고리 | 노래 | 아티스트 | 점수 |
|---------|------|---------|------|
| 발라드 | 사랑했지만 | 김광석 | 95 |
| 발라드 | 서른 즈음에 | 김광석 | 92 |
| 발라드 | 좋은 날 | 아이유 | 98 |
| 댄스 | Dynamite | BTS | 88 |
| 댄스 | 빨간 맛 | Red Velvet | 90 |
| 댄스 | Super Shy | NewJeans | 85 |
| 팝 | Bohemian Rhapsody | Queen | 78 |
| 팝 | Shape of You | Ed Sheeran | 92 |
| 팝 | Blinding Lights | The Weeknd | 87 |
| 팝 | Uptown Funk | Bruno Mars | 94 |

---

## 테스트 결과 (2026-04-03)

| # | API | 결과 |
|---|-----|------|
| 1 | 로그인 | PASS (200) |
| 2 | 로그인 실패 | PASS (401) |
| 3 | 카테고리 목록 | PASS (200) |
| 4 | 카테고리 상세 (발라드) | PASS (200) |
| 5 | 카테고리 추가 | PASS (201) |
| 6 | 카테고리 중복 | PASS (409) |
| 7 | 카테고리 수정 | PASS (200) |
| 8 | move-down | PASS (200) |
| 9 | move-up | PASS (200) |
| 10 | 카테고리 삭제 | PASS (200) |
| 11 | 노래있는 카테고리 삭제 실패 | PASS (400) |
| 12 | 노래 전체 목록 | PASS (200) |
| 13 | 노래 카테고리 필터 | PASS (200) |
| 14 | 노래 상세 | PASS (200) |
| 15 | 노래 등록 | PASS (201) |
| 16 | 노래 수정 | PASS (200) |
| 17 | 노래 삭제 | PASS (200) |
| 18 | 신청 등록 | PASS (201) |
| 19 | 신청 목록 | PASS (200) |
| 20 | 신청 검색 | PASS (200) |
| 21 | 댓글 등록 | PASS (201) |
| 22 | 댓글 삭제 (관리자) | PASS (200) |
| 23 | 신청 삭제 | PASS (200) |
| 24 | /rawbeef/api-docs | PASS (200) |
| 25 | /api-practice | PASS (200) |

**결과: 25/25 PASS**

---

## API 문서 페이지

온라인: https://www.fullstackfamily.com/rawbeef/api-docs
