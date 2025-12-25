export function hasNoSqlInjectionInKeys(
  obj: any,
  path: string = ''
): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }

  // Chỉ kiểm tra objects, không kiểm tra primitives
  if (typeof obj !== 'object') {
    return false;
  }

  // Kiểm tra arrays
  if (Array.isArray(obj)) {
    return obj.some((item, index) =>
      hasNoSqlInjectionInKeys(item, `${path}[${index}]`)
    );
  }

  // Kiểm tra object keys
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Kiểm tra key có chứa $ hoặc . không
      if (key.includes('$') || key.includes('.')) {
        return true;
      }

      // Recursive check cho nested objects
      const newPath = path ? `${path}.${key}` : key;
      if (hasNoSqlInjectionInKeys(obj[key], newPath)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Lấy danh sách các keys nguy hiểm trong object
 * Dùng cho logging và debugging
 * 
 * @param obj - Object cần kiểm tra
 * @param path - Đường dẫn hiện tại (dùng cho recursive)
 * @returns Mảng các keys nguy hiểm với full path
 * 
 * @example
 * getInjectionDetails({ email: { $ne: null }, data: { "user.role": "admin" } })
 * // Returns: ["email.$ne", "data.user.role"]
 */
export function getInjectionDetails(
  obj: any,
  path: string = ''
): string[] {
  const injectedKeys: string[] = [];

  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return injectedKeys;
  }

  // Kiểm tra arrays
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const arrayPath = `${path}[${index}]`;
      injectedKeys.push(...getInjectionDetails(item, arrayPath));
    });
    return injectedKeys;
  }

  // Kiểm tra object keys
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullPath = path ? `${path}.${key}` : key;

      // Nếu key chứa $ hoặc ., thêm vào danh sách
      if (key.includes('$') || key.includes('.')) {
        injectedKeys.push(fullPath);
      }

      // Recursive check
      injectedKeys.push(...getInjectionDetails(obj[key], fullPath));
    }
  }

  return injectedKeys;
}

/**
 * Sanitize object bằng cách loại bỏ tất cả keys nguy hiểm
 */
export function sanitizeNoSqlObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Primitives - giữ nguyên
  if (typeof obj !== 'object') {
    return obj;
  }

  // Arrays - sanitize từng phần tử
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeNoSqlObject(item));
  }

  // Objects - loại bỏ keys nguy hiểm
  const sanitized: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Bỏ qua keys chứa $ hoặc .
      if (key.includes('$') || key.includes('.')) {
        continue;
      }

      // Recursive sanitize cho nested objects
      sanitized[key] = sanitizeNoSqlObject(obj[key]);
    }
  }

  return sanitized;
}

/**
 * Kiểm tra xem string có phải là MongoDB ObjectId hợp lệ không
 * Dùng để whitelist các trường hợp legitimate sử dụng $
 * 
 * @param str - String cần kiểm tra
 * @returns true nếu là ObjectId hợp lệ
 */
export function isValidObjectId(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  // MongoDB ObjectId: 24 ký tự hex
  return /^[0-9a-fA-F]{24}$/.test(str);
}

/**
 * Các MongoDB operators nguy hiểm thường bị lạm dụng
 */
export const DANGEROUS_OPERATORS = [
  '$ne',        // Not equal - bypass authentication
  '$gt',        // Greater than - data exfiltration
  '$gte',       // Greater than or equal
  '$lt',        // Less than
  '$lte',       // Less than or equal
  '$in',        // In array
  '$nin',       // Not in array
  '$where',     // JavaScript execution - RCE risk!
  '$regex',     // Regular expression - DoS risk
  '$expr',      // Expression evaluation
  '$jsonSchema', // Schema validation bypass
  '$text',      // Text search injection
  '$mod',       // Modulo operation
  '$all',       // Array matching
  '$elemMatch', // Element matching
  '$size',      // Array size
];

/**
 * Kiểm tra xem object có chứa MongoDB operators nguy hiểm không
 * 
 * @param obj - Object cần kiểm tra
 * @returns true nếu phát hiện dangerous operators
 */
export function hasDangerousOperators(obj: any): boolean {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return obj.some((item) => hasDangerousOperators(item));
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Kiểm tra key có phải là dangerous operator không
      if (DANGEROUS_OPERATORS.includes(key)) {
        return true;
      }

      // Recursive check
      if (hasDangerousOperators(obj[key])) {
        return true;
      }
    }
  }

  return false;
}
