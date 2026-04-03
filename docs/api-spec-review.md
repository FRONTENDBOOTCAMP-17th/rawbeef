# RawBeef API 명세서 리뷰

> 리뷰어: FullStackFamily 강사
> 리뷰 일자: 2026-04-03

---

## 총평

노래방 점수 관리 앱의 API 명세서입니다. 도메인(카테고리, 노래, 노래 신청, 댓글)이 잘 분리되어 있고, 각 API의 요청/응답 예시가 포함되어 있습니다. 아래는 구현 시 문제가 될 수 있는 항목들입니다.

---

## 1. 반드시 수정해야 할 문제 (Critical)

### 1.1 Base URL이 3가지 이상 혼재

| 위치 | URL 패턴 |
|------|---------|
| 상단 정의 | `/api/rawbeef/v1` |
| 카테고리 일부 | `/api/edu/rawbeef/v1` |
| 노래 상세/등록/수정 | `/api/edu/rawbeef-648844` |
| 노래 신청 | `/support/paidsong` (Base URL 없음) |

**구현**: `/api/rawbeef/v1`로 전체 통일

---

### 1.2 HTTP 메서드 불일치

카테고리/노래 수정 API가 제목은 `PATCH`인데 실제 요청은 `PUT`으로 작성되어 있습니다.

```
### PATCH /categories/{id} — 카테고리 수정
PUT https://api.fullstackfamily.com/...    ← PUT으로 되어 있음
```

**구현**: PATCH로 통일 (부분 수정에 적합)

---

### 1.3 응답 형식 불일치

| API | 응답 형식 |
|-----|----------|
| 로그인 | `{success, data: {token, user}}` |
| 노래 신청 등록 | `{id, title, content, createdAt}` (래퍼 없음) |
| 신청 목록 | `{total, page, limit, data: [...]}` (success 없음) |
| 삭제 | `{success, message}` |

**구현**: 모든 API에서 `{success, message, data}` 형태로 통일

---

### 1.4 인증 체계 불명확

- 로그인: 비밀번호만 (`"password": "8888"`, username 없음)
- 카테고리/노래 CRUD: 토큰 필요
- 노래 신청 등록/삭제: 글 비밀번호 기반 (토큰 불필요?)
- 댓글 삭제: 토큰 필요

**구현**: 관리자는 비밀번호만으로 인증 (교육용 간소화), 노래 신청/댓글 등록은 비로그인 허용

---

### 1.5 노래 수정 JSON 문법 오류

```json
{
  "title": "수정된 노래제목"      ← 쉼표(,) 누락
  "artist": "수정된 아티스트 "    ← 쉼표 누락
  "title": "수정된 카테고리 제목"  ← title이 중복 (category 의도?)
}
```

---

### 1.6 노래 상세 조회 URL 혼란

```
GET /songs/{카테고리id}
```

파라미터가 "카테고리 ID"라면 이건 "카테고리별 노래 목록"이지 "노래 상세"가 아닙니다.

**구현**:
- `GET /songs?category=발라드` → 카테고리별 노래 목록
- `GET /songs/{songId}` → 개별 노래 상세

---

## 2. 개선하면 좋은 항목 (Important)

### 2.1 카테고리 순서 변경 API

`PATCH /categories/updateSeq`에 `{id}`를 보내면 해당 카테고리를 한 칸 아래로 이동합니다.

**구현**: 위로/아래로 명확하게 분리
- `PATCH /categories/{title}/move-up` — 한 칸 위로 (이전 카테고리와 swap)
- `PATCH /categories/{title}/move-down` — 한 칸 아래로 (다음 카테고리와 swap)

### 2.2 노래 신청 삭제 - 비밀번호가 URL에 노출

```
DELETE /support/paidsong?id=1&password=1234
```

비밀번호가 URL 쿼리파라미터에 포함되면 브라우저 히스토리/서버 로그에 기록됩니다.

**구현**: `POST /requests/{id}/delete` — body에 password 포함

### 2.3 score 타입이 string

노래 점수는 숫자가 적합합니다. `"score": "95"` → `"score": 95`

### 2.4 카테고리명을 PK로 사용

카테고리에 auto-increment id 대신 **이름(title)을 PK**로 사용합니다. 노래 테이블에서는 `"category": "발라드"` 형태로 직접 참조합니다. 명세서 원본의 `"category": "카테고리명"` 형태와 자연스럽게 일치합니다.

---

## 3. 수정 요약표

| # | 우선순위 | 항목 | 현재 | 구현 반영 |
|---|---------|------|------|----------|
| 1 | Critical | Base URL 혼재 | 3가지+ | `/api/rawbeef/v1` 통일 |
| 2 | Critical | HTTP 메서드 | PATCH/PUT 혼재 | PATCH 통일 |
| 3 | Critical | 응답 형식 | 불일치 | `{success, message, data}` |
| 4 | Critical | 인증 체계 | 불명확 | 비밀번호 관리자 + 비로그인 신청 |
| 5 | Critical | JSON 문법 | 쉼표 누락, 키 중복 | 수정 |
| 6 | Critical | 노래 상세 URL | 카테고리ID 사용 | 목록/상세 분리 |
| 7 | Important | 순서 변경 | id 1개 | move-up / move-down (swap) |
| 8 | Important | 삭제 비밀번호 | URL 파라미터 | POST body |
| 9 | Important | score 타입 | string | Integer |
| 10 | Important | category 필드 | 문자열 | 문자열 그대로 (카테고리명=PK) |
