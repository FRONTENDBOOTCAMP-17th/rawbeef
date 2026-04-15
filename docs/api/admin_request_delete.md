# 관리자 신청 삭제 API 추가 안내

> 2026-04-06: 관리자가 부적절한 노래 신청을 비밀번호 없이 삭제할 수 있는 API가 추가되었습니다.

## 신규 API

### 신청 삭제 (관리자)

```
DELETE /api/rawbeef/v1/requests/{id}
Authorization: Bearer {관리자 토큰}
```

**응답 (200)**
```json
{
  "success": true,
  "message": "Deleted successfully."
}
```

**에러**
| HTTP | 메시지 |
|------|--------|
| 401 | 인증이 필요합니다. |
| 404 | 신청을 찾을 수 없습니다. |

**참고**
- 관리자 인증 토큰이 필수입니다 (비밀번호 불필요)
- 해당 신청에 달린 댓글도 함께 삭제됩니다
- 기존 작성자 삭제 API (`POST /requests/{id}/delete` + 비밀번호)는 그대로 유지됩니다

## 삭제 API 비교

| 구분 | 작성자 삭제 | 관리자 삭제 |
|------|-----------|-----------|
| 메서드 | `POST /requests/{id}/delete` | `DELETE /requests/{id}` |
| 인증 | 불필요 | Bearer 토큰 필수 |
| body | `{ "password": "1234" }` | 없음 |

## 프론트엔드 사용 예시

```javascript
// 관리자 삭제
await fetch(`/api/rawbeef/v1/requests/${requestId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${adminToken}` },
});
```

API 문서: https://www.fullstackfamily.com/rawbeef/api-docs
