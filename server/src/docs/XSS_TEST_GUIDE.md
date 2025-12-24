# Test XSS Protection với API Login

## Endpoint: POST /api/user/auth/login

### Test Case 1: XSS trong email field

**Request:**
```bash
curl -X POST http://localhost:4000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<script>alert(\"XSS\")</script>test@example.com",
    "password": "password123"
  }'
```

**Expected Result:**
- Email sẽ được sanitize thành: `test@example.com`
- Script tag sẽ bị loại bỏ hoàn toàn

### Test Case 2: XSS trong password field

**Request:**
```bash
curl -X POST http://localhost:4000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "<script>alert(\"XSS\")</script>password123"
  }'
```

**Expected Result:**
- Password sẽ được sanitize thành: `password123`
- Script tag sẽ bị loại bỏ

### Test Case 3: Multiple XSS payloads

**Request:**
```bash
curl -X POST http://localhost:4000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<img src=x onerror=alert(\"XSS\")>test@example.com",
    "password": "<svg onload=alert(\"XSS\")>password"
  }'
```

**Expected Result:**
- Tất cả XSS tags sẽ bị loại bỏ
- Chỉ còn lại text thuần túy

### Test Case 4: JavaScript protocol

**Request:**
```bash
curl -X POST http://localhost:4000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "javascript:alert(\"XSS\")//test@example.com",
    "password": "password123"
  }'
```

**Expected Result:**
- `javascript:` protocol sẽ được sanitize

## Cách Test với Postman

### 1. Tạo Request mới
- Method: `POST`
- URL: `http://localhost:4000/api/user/auth/login`
- Headers: `Content-Type: application/json`

### 2. Body (raw JSON):
```json
{
  "email": "<script>alert('XSS')</script>test@example.com",
  "password": "<img src=x onerror=alert('XSS')>password123"
}
```

### 3. Kiểm tra kết quả

Nếu bạn bật logging (APP_ENV=dev), bạn sẽ thấy trong console:

```
[XSS Protection] Sanitized req.body: {
  path: '/api/user/auth/login',
  method: 'POST',
  original: '{"email":"<script>alert(\'XSS\')</script>test@example.com","password":"<img src=x onerror=alert(\'XSS\')>password123"}',
  sanitized: '{"email":"test@example.com","password":"password123"}'
}
```

## Common XSS Payloads để Test

```json
{
  "email": "<script>alert('XSS')</script>",
  "password": "test"
}

{
  "email": "<img src=x onerror=alert('XSS')>",
  "password": "test"
}

{
  "email": "<svg onload=alert('XSS')>",
  "password": "test"
}

{
  "email": "javascript:alert('XSS')",
  "password": "test"
}

{
  "email": "<iframe src='javascript:alert(\"XSS\")'></iframe>",
  "password": "test"
}

{
  "email": "<body onload=alert('XSS')>",
  "password": "test"
}

{
  "email": "<div onclick=alert('XSS')>Click</div>",
  "password": "test"
}
```

## Kết Quả Mong Đợi

✅ **Tất cả các payload XSS trên sẽ bị sanitize**
- Script tags → Bị loại bỏ hoàn toàn
- Event handlers (onclick, onerror, onload) → Bị loại bỏ
- JavaScript protocol → Bị loại bỏ
- Iframe/Object/Embed tags → Bị loại bỏ

✅ **Chỉ còn lại text thuần túy an toàn**

## Lưu Ý

1. **Server phải đang chạy**: `npm run dev`
2. **Logging enabled**: Set `APP_ENV=dev` để xem log sanitization
3. **Check console**: Xem log để verify sanitization hoạt động
4. **Database**: Dữ liệu lưu vào database sẽ là dữ liệu đã được sanitize

## Quick Test Script

Tạo file `test-xss.sh`:

```bash
#!/bin/bash

echo "Testing XSS Protection on Login API"
echo "===================================="

echo "\nTest 1: Script tag in email"
curl -X POST http://localhost:4000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(\"XSS\")</script>test@example.com","password":"password123"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "\nTest 2: Image onerror"
curl -X POST http://localhost:4000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<img src=x onerror=alert(\"XSS\")>test@example.com","password":"password123"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "\nTest 3: SVG onload"
curl -X POST http://localhost:4000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<svg onload=alert(\"XSS\")>test@example.com","password":"password123"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "Tests completed!"
```

Chạy: `bash test-xss.sh`
