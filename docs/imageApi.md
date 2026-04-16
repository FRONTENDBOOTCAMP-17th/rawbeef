# 곡 관련 API 명세 (추가 기능)

## 곡 번호 추가 (노래방 번호)

```
PATCH /songs/:id
```

Request Body (application/json)

| Field  | Type   | Required | Description             |
| ------ | ------ | -------- | ----------------------- |
| songNo | number | required | 노래방 번호 (예: 12345) |

Response 200

```json
{
  "id": 1,
  "title": "좋은날",
  "artist": "아이유",
  "songNo": 33393,
  "score": 980
}
```

| 코드 | 설명              |
| ---- | ----------------- |
| 400  | songNo 누락       |
| 400  | songNo 형식 오류  |
| 404  | 곡을 찾을 수 없음 |

---

## 곡 목록 조회 (중복 노래방 번호 제거)

```
GET /songs
```

Query Parameters

| Name       | Type   | Default | Description      |
| ---------- | ------ | ------- | ---------------- |
| categoryId | number | -       | 카테고리 ID 필터 |

Response 200

```json
[
  {
    "id": 1,
    "title": "좋은날",
    "artist": "아이유",
    "songNo": 33393,
    "score": 980,
    "urls": [{ "url": "https://youtu.be/xxxx" }]
  }
]
```

> `songNo`가 동일한 곡이 여러 건 존재할 경우 `score` 내림차순 기준으로 1건만 반환합니다.

# 곡 이미지 기능 API 요청서

## 배경

곡에 이미지를 추가할 수 있도록 이미지 업로드 및 관리 API가 필요합니다.
이미지는 Optional이며, 곡 등록 시 또는 수정 시 모두 추가/변경/삭제 가능해야 합니다.

---

## 요구사항

### 1. 곡 데이터 변경

곡 데이터에 `imageUrl` 필드 추가가 필요합니다.

| Field    | Type   | Required | Description   |
| -------- | ------ | -------- | ------------- |
| imageUrl | string | optional | 곡 이미지 URL |

`GET /songs`, `GET /songs/{id}`, `GET /categories/{id}` 응답에 `imageUrl` 필드가 포함되어야 합니다.

---

### 2. 이미지 업로드 API

| 항목   | 내용                        |
| ------ | --------------------------- |
| Method | POST                        |
| URL    | /api/rawbeef/v1/imageUpload |
| Auth   | Bearer Token 필요           |

**Request Body** `multipart/form-data`

| Field | Type | Required | Description          |
| ----- | ---- | -------- | -------------------- |
| image | file | required | 업로드할 이미지 파일 |

**Response 201**

```json
{
  "imageUrl": "https://..."
}
```

**Errors**

| Code | Description            |
| ---- | ---------------------- |
| 400  | 이미지 파일이 없습니다 |
| 401  | 인증이 필요합니다      |

---

### 3. 곡 이미지 수정 API

| 항목   | 내용                       |
| ------ | -------------------------- |
| Method | PATCH                      |
| URL    | /api/rawbeef/v1/songs/{id} |
| Auth   | Bearer Token 필요          |

기존 곡 수정 API에 `imageUrl` 필드 추가 요청입니다.

**Request Body**

| Field    | Type   | Required | Description                           |
| -------- | ------ | -------- | ------------------------------------- |
| imageUrl | string | optional | 이미지 URL (null 전달 시 이미지 삭제) |

---

### 4. 이미지 삭제

곡 수정 API(`PATCH /songs/{id}`)에서 `imageUrl: null` 을 전달하면 이미지가 삭제되도록 처리 부탁드립니다.

---

## UI/UX

##사용자 페이지

변경예정

| 순위 | 곡번호 | 앨범 이미지(70x70) (모바일 64x64) | 제목 | 가수 | 카테고리 | 점수 | 관리 |

##노래 관리 페이지

#현재

| 순위 | 제목 | 가수 | 카테고리 | 점수 | 관리 |

#변경예정

| 순위 | 곡번호 | 앨범 이미지 | 제목 | 가수 | 카테고리 | 점수 | 관리 |

---

##곡추가 버튼

#현재

제목

---

가수

---

카테고리

---

score

---

            유튜브 링크 추가 | 닫기 | 저장

##변경예정

제목

---

가수

---

카테고리

---

score

---

            유튜브 링크 추가 | 앨범이미지 추가

            | 닫기 | 저장
