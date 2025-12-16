# Phân Tích Bảo Mật: Lưu Trữ File Trực Tiếp vs Google Cloud Storage

## 🔴 Các Lỗ Hổng Bảo Mật Nghiêm Trọng

### 1. **Directory Listing Công Khai (CRITICAL)**
**Vị trí:** `server/src/app.ts:74-80`
```typescript
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", serveIndex(path.join(__dirname, "uploads"), {
  icons: true,
  view: "details",
}));
```

**Vấn đề:**
- Bất kỳ ai cũng có thể truy cập `http://yourdomain.com/uploads/` và xem danh sách TẤT CẢ các file
- Không có authentication/authorization
- Lộ cấu trúc thư mục, tên file, kích thước file

**Rủi ro:**
- ✅ Attacker có thể liệt kê tất cả file đã upload
- ✅ Có thể đoán được pattern tên file và truy cập trực tiếp
- ✅ Lộ thông tin nhạy cảm (avatar, file cá nhân của user)

---

### 2. **Không Có File Type Validation (HIGH)**
**Vị trí:** `server/src/routes/pub/upload_test/index.ts:25-27`
```typescript
filename: (req, file, cb) => {
  cb(null, path.basename(file.originalname)); // Chấp nhận mọi extension
}
```

**Vấn đề:**
- Không kiểm tra MIME type
- Không whitelist file extensions
- Cho phép upload bất kỳ loại file nào (`.exe`, `.php`, `.sh`, `.js`, v.v.)

**Rủi ro:**
- ✅ Upload malicious scripts (PHP, Node.js, shell scripts)
- ✅ Upload executable files có thể chạy trên server
- ✅ Upload file độc hại để exploit các lỗ hổng khác

---

### 3. **Không Có File Size Limit (MEDIUM-HIGH)**
**Vấn đề:**
- Không có giới hạn kích thước file upload
- Attacker có thể upload file cực lớn để:
  - Làm đầy disk space
  - DDoS server (tốn băng thông, CPU)
  - Crash server

---

### 4. **Path Traversal Risk (MEDIUM)**
**Vị trí:** `server/src/routes/pub/upload_test/index.ts:26`
```typescript
cb(null, path.basename(file.originalname)); // Có thể bypass
```

**Vấn đề:**
- Mặc dù dùng `path.basename()`, nhưng nếu không sanitize đúng cách vẫn có thể bị exploit
- File được lưu với tên gốc từ client (có thể chứa ký tự đặc biệt)

**Rủi ro:**
- ✅ Overwrite file hệ thống quan trọng
- ✅ Lưu file ra ngoài thư mục uploads

---

### 5. **Storage Trên Cùng Server với Application (HIGH)**
**Vấn đề:**
- File lưu trực tiếp trên server chạy application
- Nếu server bị compromise → mất tất cả dữ liệu
- Không có backup tự động
- Không có redundancy

**Rủi ro:**
- ✅ Single point of failure
- ✅ Mất dữ liệu khi server crash/hack
- ✅ Khó scale (disk space hạn chế)
- ✅ Backup thủ công, dễ quên

---

### 6. **Không Có Virus/Malware Scanning (MEDIUM)**
**Vấn đề:**
- File upload không được quét virus
- User có thể upload file độc hại

**Rủi ro:**
- ✅ Lây nhiễm malware cho user khác download
- ✅ Vi phạm compliance (GDPR, PCI-DSS)

---

### 7. **Không Có Rate Limiting Cho File Access (MEDIUM)**
**Vấn đề:**
- Static file serving không có rate limit
- Attacker có thể:
  - Download hàng loạt file (bandwidth exhaustion)
  - Scan tất cả file để tìm lỗ hổng

---

### 8. **Không Có Access Control (CRITICAL)**
**Vị trí:** `server/src/app.ts:73`
```typescript
app.use("/uploads", express.static(...)); // Public access
```

**Vấn đề:**
- Tất cả file đều public, không cần authentication
- Không có authorization check (user A có thể truy cập file của user B)

**Rủi ro:**
- ✅ User có thể truy cập file của user khác
- ✅ File nhạy cảm (avatar, document cá nhân) bị lộ

---

### 9. **Không Có CDN/Content Delivery (PERFORMANCE)**
**Vấn đề:**
- File được serve trực tiếp từ application server
- Tốn bandwidth và CPU của server
- Chậm cho user ở xa

---

## ✅ So Sánh với Google Cloud Storage

| Tiêu chí | Local Storage | Google Cloud Storage |
|----------|--------------|---------------------|
| **Access Control** | ❌ Public | ✅ IAM, Signed URLs |
| **Directory Listing** | ❌ Enabled | ✅ Disabled by default |
| **File Type Validation** | ❌ Không có | ✅ Có thể config |
| **Virus Scanning** | ❌ Không có | ✅ Cloud Security Scanner |
| **Backup/Redundancy** | ❌ Manual | ✅ Automatic |
| **Scalability** | ❌ Limited | ✅ Unlimited |
| **CDN Integration** | ❌ Không | ✅ Cloud CDN |
| **Cost** | ✅ Free (server disk) | ⚠️ Pay per use |
| **Latency** | ⚠️ Depends on server | ✅ Global edge locations |

---

## 🛡️ Khuyến Nghị Bảo Mật

### Nếu PHẢI dùng Local Storage (tạm thời):

1. **Tắt Directory Listing:**
```typescript
// XÓA dòng này:
app.use("/uploads", serveIndex(...));

// CHỈ giữ:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

2. **Thêm File Type Validation:**
```typescript
const allowedMimes = ['image/jpeg', 'image/png', 'audio/mpeg', 'application/vnd.ms-excel'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp3', '.xlsx'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter 
});
```

3. **Thêm Access Control Middleware:**
```typescript
app.use("/uploads", (req, res, next) => {
  // Kiểm tra authentication
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Kiểm tra authorization (user chỉ xem được file của mình)
  next();
}, express.static(path.join(__dirname, "uploads")));
```

4. **Sanitize Filename:**
```typescript
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const sanitized = `${req.randomId}_${Date.now()}${ext}`;
  cb(null, sanitized);
}
```

5. **Thêm Rate Limiting cho Static Files:**
```typescript
const rateLimit = require('express-rate-limit');
const staticLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use("/uploads", staticLimiter, express.static(...));
```

### Khuyến Nghị Tốt Nhất: **Chuyển sang Google Cloud Storage**

1. **Bảo mật tốt hơn:** IAM, signed URLs, access control
2. **Scalability:** Không lo hết disk space
3. **Performance:** CDN tích hợp sẵn
4. **Reliability:** Auto backup, redundancy
5. **Compliance:** Đáp ứng các tiêu chuẩn bảo mật

---

## 📊 Mức Độ Rủi Ro Tổng Thể

**Local Storage:** 🔴 **CRITICAL RISK**
- 9 lỗ hổng được phát hiện
- 3 lỗ hổng CRITICAL
- 4 lỗ hổng HIGH
- 2 lỗ hổng MEDIUM

**Khuyến nghị:** Nên chuyển sang Google Cloud Storage hoặc ít nhất implement các biện pháp bảo mật trên nếu phải dùng local storage.

