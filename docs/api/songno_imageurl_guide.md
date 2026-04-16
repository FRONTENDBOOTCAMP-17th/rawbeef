# songNo, imageUrl, 이미지 업로드 API 가이드

> 2026-04-07: 노래에 songNo(노래방 번호), imageUrl(앨범 이미지) 필드가 추가되었습니다.

API 문서: https://www.fullstackfamily.com/rawbeef/api-docs

---

## 추가된 필드

노래 응답에 다음 필드가 추가됩니다:

```json
{
  "id": 1,
  "categoryId": 1,
  "category": "발라드",
  "title": "좋은날",
  "artist": "아이유",
  "score": 95,
  "songNo": 33393,
  "imageUrl": "https://storage.fullstackfamily.com/content/rawbeef/images/abc.webp",
  "urls": [...]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `songNo` | number (선택) | 노래방 번호 (금영/TJ 등) |
| `imageUrl` | string (선택) | 앨범 이미지 URL |

---

## 이미지 업로드 API

노래에 이미지를 넣으려면 먼저 이미지를 업로드하고, 반환된 URL을 노래 등록/수정 시 사용합니다.

### 1단계: 이미지 업로드

```
POST /api/rawbeef/v1/images
Authorization: Bearer {관리자 토큰}
Content-Type: multipart/form-data
```

```bash
curl -X POST https://api.fullstackfamily.com/api/rawbeef/v1/images \
  -H "Authorization: Bearer {토큰}" \
  -F "image=@/path/to/album.jpg"
```

**응답 (201)**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://storage.fullstackfamily.com/content/rawbeef/images/abc.webp"
  }
}
```

제한:
- 최대 5MB
- JPEG, PNG, WebP, GIF만 허용

### 2단계: 노래 등록/수정 시 imageUrl 사용

```bash
# 노래 등록 시
curl -X POST https://api.fullstackfamily.com/api/rawbeef/v1/songs \
  -H "Authorization: Bearer {토큰}" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "title": "좋은날",
    "artist": "아이유",
    "score": 95,
    "songNo": 33393,
    "imageUrl": "https://storage.fullstackfamily.com/content/rawbeef/images/abc.webp"
  }'

# 기존 노래에 이미지 추가
curl -X PATCH https://api.fullstackfamily.com/api/rawbeef/v1/songs/{id} \
  -H "Authorization: Bearer {토큰}" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://storage.fullstackfamily.com/content/rawbeef/images/abc.webp"}'
```

### 이미지 삭제 (제거)

이미지를 삭제하려면 `imageUrl`에 빈 문자열을 보냅니다:

```bash
curl -X PATCH https://api.fullstackfamily.com/api/rawbeef/v1/songs/{id} \
  -H "Authorization: Bearer {토큰}" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": ""}'
```

> 필드를 아예 보내지 않으면 기존 값이 유지됩니다.

---

## songNo (노래방 번호)

### 노래 등록/수정 시 songNo 설정

```bash
# 등록 시
curl -X POST .../songs \
  -d '{"categoryId": 1, "title": "좋은날", "artist": "아이유", "score": 95, "songNo": 33393}'

# 수정 시
curl -X PATCH .../songs/{id} \
  -d '{"songNo": 33393}'
```

### songNo로 노래 조회

```
GET /api/rawbeef/v1/songs/by-song-no/{songNo}
```

```bash
curl https://api.fullstackfamily.com/api/rawbeef/v1/songs/by-song-no/33393
```

같은 songNo가 여러 카테고리에 있으면 **score가 가장 높은 1건**을 반환합니다.

### 전체 목록 조회 시 songNo 중복 제거

```
GET /api/rawbeef/v1/songs
```

- **categoryId 없이 전체 조회**: songNo가 같은 노래가 여러 건이면 score가 가장 높은 1건만 반환
- **categoryId로 필터**: 해당 카테고리의 모든 노래 반환 (중복 제거 안 함)

---

## 프론트엔드 사용 예시

```javascript
// 1. 이미지 업로드
const formData = new FormData()
formData.append('image', fileInput.files[0])

const uploadRes = await fetch('/api/rawbeef/v1/images', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData,  // Content-Type 자동 설정 (직접 설정하지 말 것!)
})
const { data: { imageUrl } } = await uploadRes.json()

// 2. 노래 등록
await fetch('/api/rawbeef/v1/songs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    categoryId: 1,
    title: '좋은날',
    artist: '아이유',
    score: 95,
    songNo: 33393,
    imageUrl: imageUrl,  // 업로드된 URL 사용
  }),
})

// 3. songNo로 조회
const song = await fetch('/api/rawbeef/v1/songs/by-song-no/33393')
  .then(r => r.json())
```

---

## 변경된 API 목록

| API | 변경 |
|-----|------|
| `POST /songs` | body에 `songNo`, `imageUrl` 추가 |
| `PATCH /songs/{id}` | body에 `songNo`, `imageUrl` 추가 (imageUrl=""으로 삭제) |
| `GET /songs` | 응답에 `songNo`, `imageUrl` 포함. 전체 조회 시 songNo 중복 제거 |
| `GET /songs/{id}` | 응답에 `songNo`, `imageUrl` 포함 |
| `GET /songs/by-song-no/{songNo}` | **신규** — songNo로 조회 |
| `POST /images` | **신규** — 이미지 업로드 (관리자) |
| `GET /categories/{id}` | songs에 `songNo`, `imageUrl` 포함 |

프로덕션에 이미 반영되었습니다.
