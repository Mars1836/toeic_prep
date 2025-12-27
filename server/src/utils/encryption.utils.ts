import crypto from 'crypto';

/**
 * Data Encryption Utilities
 * Sử dụng AES-256-GCM cho authenticated encryption
 */

// Lấy encryption key từ environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ALGORITHM = 'aes-256-gcm';

/**
 * Validate encryption key
 */
function validateKey(): void {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  // Key phải là 32 bytes (64 hex characters) cho AES-256
  if (ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }
}

/**
 * Mã hóa một string
 * @param text - Text cần mã hóa
 * @returns Encrypted string (format: iv:authTag:encryptedData)
 */
export function encrypt(text: string): string {
  if (!text) return text;
  
  validateKey();
  
  try {
    // Generate random IV (Initialization Vector) cho mỗi lần encrypt
    const iv = crypto.randomBytes(16);
    
    // Tạo cipher với key và IV
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Lấy authentication tag (GCM mode)
    const authTag = cipher.getAuthTag();
    
    // Return format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[Encryption] Error encrypting data:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Giải mã một string
 * @param encryptedText - Encrypted string (format: iv:authTag:encryptedData)
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;
  
  // Nếu không có dấu ":", có thể là plain text (data cũ chưa encrypt)
  if (!encryptedText.includes(':')) {
    return encryptedText;
  }
  
  validateKey();
  
  try {
    // Parse encrypted data
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    // Tạo decipher
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    // Set authentication tag
    decipher.setAuthTag(authTag);
    
    // Decrypt data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Error decrypting data:', error);
    // Return original nếu decrypt fail (có thể là data cũ)
    return encryptedText;
  }
}

/**
 * Mã hóa các fields cụ thể trong một object
 * @param obj - Object cần mã hóa
 * @param fields - Mảng các field paths cần mã hóa (hỗ trợ nested: 'personalInfo.phone')
 * @returns Object với các fields đã được mã hóa
 */
export function encryptObject(obj: any, fields: string[]): any {
  if (!obj) return obj;
  
  const result = { ...obj };
  
  for (const fieldPath of fields) {
    const value = getNestedValue(result, fieldPath);
    if (value && typeof value === 'string') {
      setNestedValue(result, fieldPath, encrypt(value));
    }
  }
  
  return result;
}

/**
 * Giải mã các fields cụ thể trong một object
 * @param obj - Object cần giải mã
 * @param fields - Mảng các field paths cần giải mã
 * @returns Object với các fields đã được giải mã
 */
export function decryptObject(obj: any, fields: string[]): any {
  if (!obj) return obj;
  
  const result = { ...obj };
  
  for (const fieldPath of fields) {
    const value = getNestedValue(result, fieldPath);
    if (value && typeof value === 'string') {
      setNestedValue(result, fieldPath, decrypt(value));
    }
  }
  
  return result;
}

/**
 * Lấy giá trị nested từ object
 * @param obj - Object
 * @param path - Path (e.g., 'personalInfo.phone')
 * @returns Giá trị tại path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set giá trị nested trong object
 * @param obj - Object
 * @param path - Path (e.g., 'personalInfo.phone')
 * @param value - Giá trị mới
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Generate encryption key (dùng để tạo key mới)
 * @returns 32-byte hex string
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Kiểm tra xem một string có phải là encrypted data không
 * @param text - String cần kiểm tra
 * @returns true nếu là encrypted data
 */
export function isEncrypted(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  
  // Encrypted data có format: iv:authTag:encryptedData
  const parts = text.split(':');
  if (parts.length !== 3) return false;
  
  // Kiểm tra xem các parts có phải là hex không
  const hexRegex = /^[0-9a-f]+$/i;
  return parts.every(part => hexRegex.test(part));
}
