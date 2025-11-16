# JWT Authentication cho User

Đã chuyển đổi từ Passport session authentication sang JWT authentication cho user.

## 📋 Tổng Quan

- **Access Token**: JWT token ngắn hạn (15 phút), dùng để authenticate requests
- **Refresh Token**: JWT token dài hạn (7 ngày), lưu trong Redis, dùng để tạo access token mới
- **Admin**: Vẫn dùng Passport (không thay đổi)

## 🔧 Cấu Hình

### Environment Variables

Thêm vào `.env`:
```env
JWT_SECRET_LOCAL=your-access-token-secret
JWT_REFRESH_SECRET_LOCAL=your-refresh-token-secret
JWT_ACCESS_TOKEN_TTL=15m                  # Access token TTL (default: 15m)
JWT_REFRESH_TOKEN_TTL=7d                  # Refresh token TTL (default: 7d)
```

**Format cho JWT_ACCESS_TOKEN_TTL và JWT_REFRESH_TOKEN_TTL:**
- `90s` = 90 seconds
- `15m` = 15 minutes
- `1h` = 1 hour
- `2d` = 2 days
- `7d` = 7 days (default cho refresh token)
- `30d` = 30 days

**Ví dụ:**
- `JWT_ACCESS_TOKEN_TTL=30m` = 30 phút
- `JWT_REFRESH_TOKEN_TTL=14d` = 14 ngày
- `JWT_REFRESH_TOKEN_TTL=12h` = 12 giờ

### Files Đã Tạo

1. **`server/src/services/jwt/index.ts`**: 
   - Generate access token và refresh token
   - Verify tokens
   - Revoke refresh tokens

2. **`server/src/middlewares/jwt_auth.ts`**: 
   - Middleware để verify JWT access token từ Authorization header

3. **`server/src/middlewares/authenticate_user.ts`**: 
   - Middleware kết hợp jwtAuth + requireAuth (optional)

## 📝 API Endpoints

### 1. Signup
```http
POST /api/user/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Cookies `access_token` và `refresh_token` được tự động set bởi server*

### 2. Login
```http
POST /api/user/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "avatar_url"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Cookies `access_token` và `refresh_token` được tự động set bởi server*

### 3. Refresh Token
Tạo access token mới từ refresh token khi access token hết hạn.
Refresh token có thể gửi từ body hoặc cookie (tự động lấy từ cookie nếu không có trong body).

```http
POST /api/user/auth/refresh
Content-Type: application/json
Cookie: refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Hoặc gửi trong body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Cookie `access_token` mới được tự động set bởi server*

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token
- `401 Unauthorized`: Refresh token is required
- `400 Bad Request`: User not found

### 4. Logout
```http
POST /api/user/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### 5. Get Current User
```http
GET /api/user/auth/current-user
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "name": "John Doe",
  ...
}
```

## 🔒 Protected Routes

Tất cả routes trong `/api/user/*` (trừ auth routes) đều yêu cầu authentication.

Middleware `requireAuth` tự động verify JWT token từ `Authorization` header hoặc cookie (giống Passport).

### Cách Sử Dụng Trong Client

#### Option 1: Sử dụng Cookies (Recommended - giống Passport)
**Tokens được tự động set trong cookies, không cần lưu thủ công:**

```javascript
// 1. Login - cookies được tự động set bởi server
const response = await fetch('/api/user/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Quan trọng: để gửi cookies
  body: JSON.stringify({ email, password })
});

const { user } = await response.json();
// Cookies đã được set tự động: access_token và refresh_token

// 2. Gửi request - cookies tự động được gửi kèm
const protectedResponse = await fetch('/api/user/profile', {
  credentials: 'include', // Quan trọng: để gửi cookies
  // Không cần Authorization header nếu dùng cookie
});

// 3. Refresh token - có thể gửi từ cookie hoặc body
const refreshResponse = await fetch('/api/user/auth/refresh', {
  method: 'POST',
  credentials: 'include', // Cookies tự động được gửi
  // refreshToken sẽ được lấy từ cookie nếu không có trong body
});
```

#### Option 2: Sử dụng Authorization Header (Manual)
**Nếu muốn tự quản lý tokens:**

```javascript
// 1. Login và lưu tokens
const response = await fetch('/api/user/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
});
const { accessToken, refreshToken } = await response.json();

// Lưu tokens (localStorage)
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// 2. Gửi access token trong Authorization header
const protectedResponse = await fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// 3. Nếu access token hết hạn (401), refresh token
if (protectedResponse.status === 401) {
  // Nếu dùng cookies, chỉ cần gọi refresh endpoint
  const refreshResponse = await fetch('/api/user/auth/refresh', {
    method: 'POST',
    credentials: 'include', // Cookies tự động được gửi
  });
  
  if (!refreshResponse.ok) {
    // Refresh token cũng hết hạn, redirect to login
    window.location.href = '/login';
    return;
  }
  
  // Cookie mới đã được set tự động
  // Retry request với cookie mới
  // ... retry logic
}
```

**Lưu ý khi dùng Cookies:**
- Phải set `credentials: 'include'` trong mọi fetch request
- Cookies tự động được gửi và nhận, không cần quản lý thủ công
- HttpOnly cookies bảo vệ tốt hơn khỏi XSS attacks
- CORS phải có `credentials: true` (đã config trong server)

## 🛠️ Middleware

### `jwtAuth`
Verify JWT access token từ Authorization header hoặc cookie:
- Ưu tiên: Authorization header (`Bearer <token>`)
- Fallback: Cookie (`access_token`)
```typescript
import { jwtAuth } from '../middlewares/jwt_auth';

router.get('/protected', jwtAuth, (req, res) => {
  // req.user đã có thông tin user
});
```

### `requireAuth`
Tự động verify JWT từ header hoặc cookie, sau đó check user:
- Tự động đọc từ Authorization header hoặc cookie
- Giống Passport, không cần gọi jwtAuth trước
```typescript
import { requireAuth } from '../middlewares/require_auth';

router.get('/protected', requireAuth, (req, res) => {
  // req.user đã có thông tin user (tự động từ cookie hoặc header)
});
```

### `authenticateUser`
Kết hợp jwtAuth + requireAuth:
```typescript
import { authenticateUser } from '../middlewares/authenticate_user';

router.get('/protected', authenticateUser, (req, res) => {
  // req.user đã có thông tin user
});
```

## ⚠️ Lưu Ý

1. **Access Token** TTL được config qua `JWT_ACCESS_TOKEN_TTL` (mặc định: `15m` = 15 phút)
2. **Refresh Token** TTL được config qua `JWT_REFRESH_TOKEN_TTL` (mặc định: `7d` = 7 ngày)
3. Khi logout, refresh token sẽ bị revoke (xóa khỏi Redis)
4. Passport vẫn được dùng cho **admin** routes
5. Tất cả user routes tự động yêu cầu JWT authentication

## 🔄 Migration từ Passport Session

- ✅ Không còn dùng `req.session`
- ✅ Không còn dùng `req.login()`
- ✅ Không còn dùng `passportU.authenticate()`
- ✅ JWT tokens được tự động set trong cookies (giống Passport)
- ✅ Client có thể dùng cookies hoặc Authorization header
- ✅ Cookies tự động được gửi kèm mọi request (với `credentials: 'include'`)

## 📚 Tài Liệu Tham Khảo

- [JWT.io](https://jwt.io/)
- [JSON Web Token Best Practices](https://tools.ietf.org/html/rfc8725)

