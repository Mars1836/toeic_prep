import { Schema } from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption.utils';

/**
 * Mongoose Plugin cho Field-Level Encryption
 * Tự động encrypt khi save và decrypt khi query
 */

export interface EncryptionPluginOptions {
  /**
   * Mảng các field paths cần encrypt
   * Hỗ trợ nested fields: ['email', 'personalInfo.phone']
   */
  fields: string[];
  
  /**
   * Có log encryption/decryption không (dev mode)
   */
  debug?: boolean;
}

/**
 * Plugin function
 */
export function encryptionPlugin(schema: Schema, options: EncryptionPluginOptions) {
  const { fields, debug = false } = options;
  
  if (!fields || fields.length === 0) {
    console.warn('[Encryption Plugin] No fields specified for encryption');
    return;
  }
  
  /**
   * Pre-save hook: Encrypt fields trước khi lưu vào DB
   */
  schema.pre('save', function(next) {
    try {
      for (const fieldPath of fields) {
        const value = getNestedValue(this, fieldPath);
        
        if (value && typeof value === 'string') {
          // Chỉ encrypt nếu chưa được encrypt
          const currentValue = value as string;
          if (!isAlreadyEncrypted(currentValue)) {
            const encrypted = encrypt(currentValue);
            setNestedValue(this, fieldPath, encrypted);
            
            if (debug) {
              console.log(`[Encryption] Encrypted field: ${fieldPath}`);
            }
          }
        }
      }
      next();
    } catch (error) {
      console.error('[Encryption Plugin] Error in pre-save hook:', error);
      next(error as Error);
    }
  });
  
  /**
   * Post-find hook: Decrypt fields sau khi query từ DB
   */
  schema.post('find', function(docs: any[]) {
    if (!docs || docs.length === 0) return;
    
    try {
      for (const doc of docs) {
        decryptDocument(doc, fields, debug);
      }
    } catch (error) {
      console.error('[Encryption Plugin] Error in post-find hook:', error);
    }
  });
  
  /**
   * Post-findOne hook: Decrypt fields sau khi query một document
   */
  schema.post('findOne', function(doc: any) {
    if (!doc) return;
    
    try {
      decryptDocument(doc, fields, debug);
    } catch (error) {
      console.error('[Encryption Plugin] Error in post-findOne hook:', error);
    }
  });
  
  /**
   * Post-findOneAndUpdate hook: Decrypt sau khi update
   */
  schema.post('findOneAndUpdate', function(doc: any) {
    if (!doc) return;
    
    try {
      decryptDocument(doc, fields, debug);
    } catch (error) {
      console.error('[Encryption Plugin] Error in post-findOneAndUpdate hook:', error);
    }
  });

  /**
   * Post-insertMany hook: Decrypt sau khi insert nhiều documents
   */
  schema.post('insertMany', function(docs: any[]) {
    if (!docs || docs.length === 0) return;
    
    try {
      for (const doc of docs) {
        decryptDocument(doc, fields, debug);
      }
    } catch (error) {
      console.error('[Encryption Plugin] Error in post-insertMany hook:', error);
    }
  });
  
  /**
   * Post-aggregate hook: Decrypt sau khi aggregate
   */
  schema.post('aggregate', function(docs: any[]) {
    if (!docs || docs.length === 0) return;
    
    try {
      for (const doc of docs) {
        decryptDocument(doc, fields, debug);
      }
    } catch (error) {
      console.error('[Encryption Plugin] Error in post-aggregate hook:', error);
    }
  });
}

/**
 * Decrypt tất cả encrypted fields trong một document
 */
function decryptDocument(doc: any, fields: string[], debug: boolean): void {
  for (const fieldPath of fields) {
    const value = getNestedValue(doc, fieldPath);
    
    if (value && typeof value === 'string') {
      const decrypted = decrypt(value);
      setNestedValue(doc, fieldPath, decrypted);
      
      if (debug && value !== decrypted) {
        console.log(`[Encryption] Decrypted field: ${fieldPath}`);
      }
    }
  }
}

/**
 * Lấy giá trị nested từ object
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set giá trị nested trong object
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
 * Kiểm tra xem string đã được encrypt chưa
 * Encrypted data có format: iv:authTag:encryptedData
 */
function isAlreadyEncrypted(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  
  const parts = text.split(':');
  if (parts.length !== 3) return false;
  
  // Kiểm tra xem các parts có phải là hex không
  const hexRegex = /^[0-9a-f]+$/i;
  return parts.every(part => hexRegex.test(part));
}
