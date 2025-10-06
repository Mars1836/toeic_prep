# Hướng dẫn sử dụng Socket.IO với Ngrok

## 1. Cài đặt và chạy Ngrok

```bash
# Cài đặt ngrok (nếu chưa có)
# Tải từ: https://ngrok.com/download

# Chạy ngrok để expose port 4000
ngrok http 4000
```

Sau khi chạy, bạn sẽ thấy output như:
```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:4000
Forwarding                    http://abc123.ngrok.io -> http://localhost:4000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Lưu ý URL ngrok của bạn** (ví dụ: `https://abc123.ngrok.io`)

## 2. Cập nhật Client Code

### JavaScript/HTML Client:
```javascript
// Thay YOUR_NGROK_URL bằng URL ngrok thực tế
const NGROK_URL = 'https://abc123.ngrok.io';
const socket = io(NGROK_URL);

// API calls cũng sử dụng ngrok URL
fetch(NGROK_URL + '/api/user/aichat/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    content: "Xin chào, tôi muốn học TOEIC",
    socketId: socket.id
  })
});
```

### Flutter/Dart Client:
```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

// Kết nối Socket.IO
IO.Socket socket = IO.io('https://abc123.ngrok.io', <String, dynamic>{
  'transports': ['websocket', 'polling'],
  'autoConnect': false,
});

socket.connect();

// Lắng nghe events
socket.on('session_created', (data) {
  print('Session created: ${data['sessionId']}');
});

socket.on('chat_stream', (data) {
  print('Stream chunk: ${data['chunk']}');
});
```

## 3. Test API với Ngrok

### Test cơ bản:
```bash
curl https://abc123.ngrok.io/test
```

### Test Socket.IO:
```bash
# Sử dụng file test-socket.html
# Mở file trong browser và thay YOUR_NGROK_URL
```

## 4. Cấu hình Ngrok cho Production

### Ngrok với custom domain (Pro):
```bash
ngrok http 4000 --hostname=your-custom-domain.ngrok.io
```

### Ngrok với authentication:
```bash
ngrok http 4000 --basic-auth="username:password"
```

## 5. Troubleshooting

### Lỗi CORS:
- Server đã được cấu hình `origin: "*"` nên sẽ hoạt động với ngrok
- Nếu vẫn lỗi, kiểm tra headers trong browser dev tools

### Lỗi WebSocket:
- Ngrok hỗ trợ WebSocket, nhưng có thể fallback về polling
- Server đã cấu hình `transports: ["websocket", "polling"]`

### Lỗi Authentication:
- Đảm bảo gửi đúng token trong header `Authorization`
- Kiểm tra session cookie nếu sử dụng cookie-based auth

## 6. Monitoring

### Ngrok Web Interface:
- Truy cập `http://127.0.0.1:4040` để xem traffic
- Có thể inspect requests/responses

### Server Logs:
```bash
# Xem logs server
npm run dev
```

## 7. Security Notes

⚠️ **Cảnh báo**: Ngrok free plan không bảo mật, URL có thể bị thay đổi
- Sử dụng ngrok Pro cho production
- Hoặc deploy lên server thực tế cho production
- Luôn sử dụng HTTPS trong production
