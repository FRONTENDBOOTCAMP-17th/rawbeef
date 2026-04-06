# RawBeef API v2 가이드

> 2026-04-06 업데이트: 카테고리 ID 기반 전환, YouTube URL 다건 관리, 댓글 관리자 인증

Base URL: `https://api.fullstackfamily.com/api/rawbeef/v1`

API 문서 (인터랙티브): https://www.fullstackfamily.com/rawbeef/api-docs

---

## 주요 변경사항 (v1 → v2)

| 항목 | v1 (이전) | v2 (현재) |
|------|----------|----------|
| 카테고리 PK | `title` (String) | `id` (Long) |
| 카테고리 URL | `/categories/발라드` | `/categories/1` |
| 노래 등록 시 카테고리 | `"category": "발라드"` | `"categoryId": 1` |
| 노래 필터 | `?category=발라드` | `?categoryId=1` |
| YouTube URL | `"url": "단일 문자열"` | `"urls": [{ urlId, url }, ...]` |
| 댓글 등록 | 누구나 가능 | **관리자 인증 필수** |
| 댓글 개수 | 배열 (여러 개) | **신청당 최대 1개** (단일 객체 또는 null) |

---

## 인증

관리자 로그인 후 받은 토큰을 `Authorization` 헤더에 포함합니다.

```bash
# 로그인
curl -X POST {BASE}/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "8888"}'

# 응답
{ "token": "eyJhbGci...", "user": { "id": 1, "username": "admin" } }
```

인증이 필요한 API:
- 카테고리 생성/수정/이동/삭제
- 노래 등록/수정/삭제
- YouTube URL 추가/삭제
- 댓글 등록/삭제

```
-H "Authorization: Bearer {토큰}"
```

---

## 카테고리 API

### 목록 조회
```
GET /categories
```
```json
[
  { "id": 1, "title": "발라드", "sortOrder": 0, "createdAt": "2026-04-06T10:00:00" },
  { "id": 2, "title": "댄스", "sortOrder": 1, "createdAt": "2026-04-06T10:00:00" },
  { "id": 3, "title": "팝", "sortOrder": 2, "createdAt": "2026-04-06T10:00:00" }
]
```

### 상세 조회 (노래 포함)
```
GET /categories/{id}
```
```json
{
  "id": 1,
  "title": "발라드",
  "sortOrder": 0,
  "songs": [
    {
      "id": 1, "categoryId": 1, "category": "발라드",
      "title": "사랑했지만", "artist": "김광석", "score": 95,
      "urls": [{ "urlId": 1, "url": "https://youtube.com/watch?v=..." }],
      "createdAt": "2026-04-06T10:00:00"
    }
  ]
}
```

### 생성 (관리자)
```
POST /categories
Authorization: Bearer {토큰}

{ "title": "랩/힙합" }
→ 201 { "id": 4, "title": "랩/힙합", "sortOrder": 3, ... }
```
> 슬래시(/)가 포함된 카테고리명도 정상 동작합니다.

### 수정 (관리자)
```
PATCH /categories/{id}
Authorization: Bearer {토큰}

{ "title": "새이름" }
→ 200 { "id": 4, "title": "새이름", ... }
```

### 순서 이동 (관리자)
```
PATCH /categories/{id}/move-up
PATCH /categories/{id}/move-down
Authorization: Bearer {토큰}
```

### 삭제 (관리자)
```
DELETE /categories/{id}
Authorization: Bearer {토큰}
```
> 노래가 있는 카테고리는 삭제할 수 없습니다.

---

## 노래 API

### 목록 조회
```
GET /songs
GET /songs?categoryId=1    ← 카테고리 필터
```
```json
[
  {
    "id": 1,
    "categoryId": 1,
    "category": "발라드",
    "title": "사랑했지만",
    "artist": "김광석",
    "score": 95,
    "urls": [
      { "urlId": 1, "url": "https://youtube.com/watch?v=abc" },
      { "urlId": 2, "url": "https://youtube.com/watch?v=xyz" }
    ],
    "createdAt": "2026-04-06T10:00:00"
  }
]
```

### 상세 조회
```
GET /songs/{id}
```

### 등록 (관리자)
```
POST /songs
Authorization: Bearer {토큰}

{
  "categoryId": 1,
  "title": "밤편지",
  "artist": "아이유",
  "score": 98
}
→ 201
```
> URL은 포함하지 않습니다. 노래 등록 후 별도로 URL을 추가합니다.

### 수정 (관리자)
```
PATCH /songs/{id}
Authorization: Bearer {토큰}

{ "score": 99 }
```
> 수정할 필드만 보내면 됩니다.

### 삭제 (관리자)
```
DELETE /songs/{id}
Authorization: Bearer {토큰}
```

---

## YouTube URL API

노래 1건에 여러 YouTube URL을 등록할 수 있습니다.

### URL 추가 (관리자)
```
POST /songs/{songId}/urls
Authorization: Bearer {토큰}

{ "url": "https://youtube.com/watch?v=abc123" }
→ 201 { "urlId": 5, "url": "https://youtube.com/watch?v=abc123" }
```

### URL 삭제 (관리자)
```
DELETE /songs/urls/{urlId}
Authorization: Bearer {토큰}
→ 200
```

### 프론트엔드에서의 사용 예시

```javascript
// 노래 목록에서 URL 표시
const songs = await fetch('/api/rawbeef/v1/songs').then(r => r.json());

songs.data.forEach(song => {
  console.log(song.title, song.artist);
  song.urls.forEach(u => {
    console.log(`  - ${u.url} (urlId: ${u.urlId})`);
  });
});

// URL 추가
await fetch(`/api/rawbeef/v1/songs/${songId}/urls`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ url: 'https://youtube.com/watch?v=newVideo' }),
});

// URL 삭제
await fetch(`/api/rawbeef/v1/songs/urls/${urlId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` },
});
```

---

## 노래 신청 API

### 신청 목록
```
GET /requests?page=1&limit=30&search=검색어
```
```json
{
  "data": [
    {
      "id": 1,
      "title": "밤편지 신청",
      "content": "아이유 밤편지 추가해주세요",
      "createdAt": "2026-04-06T10:00:00",
      "likes": 3,
      "comment": {
        "id": 1,
        "content": "추가했습니다!",
        "createdAt": "2026-04-06T11:00:00"
      }
    },
    {
      "id": 2,
      "title": "Butter 신청",
      "content": "BTS Butter 추가 부탁",
      "createdAt": "2026-04-06T10:30:00",
      "likes": 0
    }
  ],
  "meta": { "total": 2, "page": 1, "limit": 30 }
}
```
> `comment`는 배열이 아닌 **단일 객체**입니다. 댓글이 없으면 필드가 생략됩니다.

### 신청 상세
```
GET /requests/{id}
```

### 신청 등록 (누구나)
```
POST /requests

{
  "title": "노래 제목 신청",
  "content": "신청 내용",
  "password": "1234"
}
→ 201
```

### 신청 삭제 (비밀번호 필요)
```
POST /requests/{id}/delete

{ "password": "1234" }
```

---

## 관리자 댓글 API

신청 1건당 관리자 댓글은 **최대 1개**만 등록할 수 있습니다.

### 댓글 등록 (관리자)
```
POST /requests/{requestId}/comments
Authorization: Bearer {토큰}

{ "content": "답변 내용" }
→ 201 { "postId": 1, "commentId": 5, "content": "답변 내용", ... }
```
> 이미 댓글이 있으면 400 에러가 반환됩니다. 기존 댓글을 삭제 후 다시 등록해주세요.

### 댓글 삭제 (관리자)
```
DELETE /requests/comments/{commentId}
Authorization: Bearer {토큰}
```

---

## 에러 코드

| HTTP | 의미 | 상황 |
|------|------|------|
| 400 | Bad Request | 유효성 검증 실패, 중복 댓글 |
| 401 | Unauthorized | 인증 토큰 없음/만료 |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 중복 카테고리명 |
