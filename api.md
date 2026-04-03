# Education Practice API

**워크스페이스**: rawbeef

**Base URL**: `https://api.fullstackfamily.com/api/rawbeef/v1`

---

## 인증 (Authentication)

JWT Bearer Token 방식입니다. 비밀번호 입력을 통해 API로 토큰을 발급받아 `Authorization: Bearer {token}` 헤더로 전달합니다.

---

## 1. Auth

### POST /auth/login — 로그인

```
POST https://api.fullstackfamily.com/api/rawbeef/v1/auth/login
Content-Type: application/json

{
  "password": "8888"
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": { "id": 1, "username": "admin" }
  }
}
```

---

## 2. category

### GET/categories — 카테고리 목록

```
GET https://api.fullstackfamily.com/api/rawbeef/v1/categories
Authorization: Bearer {token}
```

### GET /categories/{id} — 카테고리 상세 (공개)

```
GET https://api.fullstackfamily.com/api/edu/rawbeef/v1/categories/{id}
Authorization: Bearer {token}
```

### POST /categories — 카테고리 추가

```
POST https://api.fullstackfamily.com/api/edu/rawbeef/v1/categories
Authorization: Bearer {token}

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| title | string | N | 카테고리 명 |

```

새로운 카테고리가 추가됩니다

### PATCH /categories/{id} — 카테고리 수정 🔒

```
PUT https://api.fullstackfamily.com/api/edu/rawbeef/v1/categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "수정된 카테고리 제목"
}
```

### PATCH/categories/updateSeq — 카테고리 위치수정 🔒

```
PUT https://api.fullstackfamily.com/api/edu/rawbeef/v1/categories/updateSeq
Authorization: Bearer {token}
```

{
"id": "수정된 카테고리 Id"
}

드래그 드롭으로 구현했습니다

### DELETE /categories/{id} — 카테고리 삭제 🔒

```
DELETE https://api.fullstackfamily.com/api/edu/rawbeef/v1/categories/{id}
Authorization: Bearer {token}
```

## 2. songs

### GET/songs — 노래 목록 조회

```
GET https://api.fullstackfamily.com/api/rawbeef/v1/songs
Authorization: Bearer {token}
```

### GET /songs/{id} — 노래 카테고리에 따른 상세 조회

```
GET https://api.fullstackfamily.com/api/edu/rawbeef-648844/songs/{카테고리id}
Authorization: Bearer {token}
```

### POST /songs — 노래 신규 등록

```
POST https://api.fullstackfamily.com/api/edu/rawbeef-648844/songs
Authorization: Bearer {token}

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| title | string | N | 노래 제목|
| artist | string | N | 아티스트  |
| category | string | N | 카테고리 |
| score | string | N | 노래 점수 |
| url | string | optional | 유튜브url |
```

새로운 노래가 추가됩니다

### PATCH /songs/{id} — 카테고리 수정 🔒

```
PUT https://api.fullstackfamily.com/api/edu/rawbeef-648844/songs/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "수정된 노래제목"
  "artist": "수정된 아티스트 "
  "category": "수정된 카테고리"
  "score": "수정된 점수 "
  "title": "수정된 카테고리 제목"
  "url": "수정된 유튜브 url"
}
```

### DELETE /songs/{id} — 카테고리 삭제

```
DELETE https://api.fullstackfamily.com/api/edu/rawbeef/v1/songs/{id}
Authorization: Bearer {token}
```

## 노래 신청 등록

```
POST /support/paidsong
```

Request Body (application/json)
Field | Type | Required | Description|
|---------|------|------|------|
| title | string | required | 신청 제목 (1~50자) |
| content | string | required | 신청 내용 (1~300자) |
| password | string | required | 4~10자리 |

Response 201
{
"id" : 1,
"title" : "제목",
"content" : "내용",
"createdAt" : "2025-01-15T10:30:00"
}

| 코드 | 설명               |
| ---- | ------------------ |
| 400  | 제목 누락          |
| 400  | 제목 50자 초과     |
| 400  | 내용 누락          |
| 400  | 내용 300자 초과    |
| 400  | 비밀번호 누락      |
| 400  | 비밀번호 4자 미만  |
| 400  | 비밀번호 10자 초과 |

## 노래 신청 삭제

```
DELETE /support/paidsong?id=글번호&password=암호
```

Param (application/json)
| Param | Type | Required | Description |
|---------|------|------|------|
| Field | Type | Required | Description |
| id | number | required | 글 번호 |
| password | string | required | 4~10자리 |

Response 200
{
"success" : true,
"message" : "삭제되었습니다"
}

| 코드 | 설명          |
| ---- | ------------- |
| 400  | 비밀번호 오류 |

## 노래 신청 목록 조회

```
GET /support/paidsong
```

Params
| Param | Type | Required | Description |
| page | number | optional | 페이지 번호 (없으면 1) |
| limit | number | optional | 페이지당 항목 수 (없으면 30, 최대 30) |
| search | string | optional | 제목/내용 검색어 |

Response 200
{
"total" : 100,
"page" : 1,
"limit" : 30,
"data" : [
{
"id" : 1,
"title" : "제목",
"content" : "내용",
"createdAt" : "2025-01-15T10:30:00",
"likes" : 0,
"comments" :
{
"content" : "댓글 내용",
"createdAt" : "2025-01-15T10:30:00"
}
}
]
}

Errors
| 코드 | 설명 |
|------|------|
| 400 | limit 30 초과 |
| 400 | page 0 이하 |

## 댓글 등록

```
POST /support/paidsong/comments
```

Request Body (application/json)
| Field | Type | Required | Description |
|---------|--------|----------|-------------|
| id | number | required | 글 번호 |
| content | string | required | 댓글 내용 |

Response 201
{
"postId" : 1,
"commentId" : 1,
"content" : "댓글 내용",
"createdAt" : "2025-01-15T10:30:00"
}

## 댓글 삭제

```
DELETE /support/paidsong/comments?id=댓글번호
```

Request Header
| Header | Type | Required | Description |
|---------------|--------|----------|-------------|
| Authorization | string | required | 인증 토큰 |

Response 200
{
"success" : true,
"message" : "삭제되었습니다"
}

| 코드 | 설명      |
| ---- | --------- |
| 401  | 인증 실패 |
