import xss from 'xss';

/**
 * XSS Protection Utilities
 * Các hàm tiện ích để bảo vệ chống tấn công XSS
 */

// Cấu hình XSS filter mặc định
const xssOptions = {
  whiteList: {}, // Không cho phép bất kỳ HTML tag nào
  stripIgnoreTag: true, // Loại bỏ các tag không được phép
  stripIgnoreTagBody: ['script', 'style'], // Loại bỏ CẢ NỘI DUNG của script và style tags (bảo mật cao)
};

/**
 * Sanitize một chuỗi để loại bỏ XSS
 * @param input - Chuỗi cần sanitize
 * @returns Chuỗi đã được làm sạch
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  return xss(input, xssOptions);
}

/**
 * Sanitize toàn bộ object (recursive)
 * @param obj - Object cần sanitize
 * @param whitelist - Mảng các key không cần sanitize
 * @returns Object đã được làm sạch
 */
export function sanitizeObject(
  obj: any,
  whitelist: string[] = []
): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Nếu là string, sanitize nó
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  // Nếu là array, sanitize từng phần tử
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, whitelist));
  }

  // Nếu là object, sanitize từng property
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Nếu key nằm trong whitelist, giữ nguyên
        if (whitelist.includes(key)) {
          sanitized[key] = obj[key];
        } else {
          sanitized[key] = sanitizeObject(obj[key], whitelist);
        }
      }
    }
    return sanitized;
  }

  // Các kiểu dữ liệu khác (number, boolean, etc.) giữ nguyên
  return obj;
}

/**
 * Sanitize HTML với các option linh hoạt hơn
 * Sử dụng khi cần cho phép một số HTML tags (ví dụ: blog content)
 * @param html - HTML cần sanitize
 * @param allowedTags - Mảng các tag được phép
 * @returns HTML đã được làm sạch
 */
export function sanitizeHtml(
  html: string,
  allowedTags: string[] = []
): string {
  if (typeof html !== 'string') {
    return html;
  }

  // Nếu không có tag nào được phép, sử dụng sanitizeString
  if (allowedTags.length === 0) {
    return sanitizeString(html);
  }

  // Tạo whitelist từ allowedTags
  const whiteList: any = {};
  allowedTags.forEach((tag) => {
    whiteList[tag] = []; // Cho phép tag nhưng không cho phép attributes
  });

  return xss(html, {
    whiteList,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  });
}

/**
 * Escape HTML entities
 * Chuyển đổi các ký tự đặc biệt thành HTML entities
 * @param text - Text cần escape
 * @returns Text đã được escape
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return text;
  }

  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Kiểm tra xem input có chứa pattern XSS không
 * @param input - Input cần kiểm tra
 * @returns true nếu phát hiện XSS pattern
 */
export function isXssAttempt(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  // Các pattern XSS phổ biến
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onerror, onload, etc.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<img[^>]+src[^>]*>/gi,
    /eval\(/gi,
    /expression\(/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize URL để tránh javascript: protocol
 * @param url - URL cần sanitize
 * @returns URL đã được làm sạch hoặc empty string nếu nguy hiểm
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmedUrl = url.trim().toLowerCase();

  // Chặn các protocol nguy hiểm
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
  ];

  if (dangerousProtocols.some((protocol) => trimmedUrl.startsWith(protocol))) {
    return '';
  }

  return url;
}
