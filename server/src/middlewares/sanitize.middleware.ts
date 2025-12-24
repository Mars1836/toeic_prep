import { Request, Response, NextFunction } from 'express';
import { sanitizeObject } from '../utils/xss.utils';

/**
 * Middleware Options
 */
export interface SanitizeOptions {
  /**
   * Danh sách các field không cần sanitize (giữ nguyên)
   * Ví dụ: ['blogContent', 'htmlDescription']
   */
  whitelist?: string[];

  /**
   * Có sanitize req.body không (mặc định: true)
   */
  sanitizeBody?: boolean;

  /**
   * Có sanitize req.query không (mặc định: true)
   */
  sanitizeQuery?: boolean;

  /**
   * Có sanitize req.params không (mặc định: true)
   */
  sanitizeParams?: boolean;

  /**
   * Có log các giá trị đã sanitize không (mặc định: false)
   */
  logSanitized?: boolean;
}

/**
 * Middleware để tự động sanitize input từ request
 * Loại bỏ các XSS patterns từ req.body, req.query, và req.params
 * 
 * @param options - Cấu hình cho middleware
 * @returns Express middleware function
 * 
 * @example
 * // Sử dụng với cấu hình mặc định
 * app.use(sanitizeInput());
 * 
 * @example
 * // Sử dụng với whitelist
 * app.use(sanitizeInput({ 
 *   whitelist: ['blogContent', 'htmlDescription'] 
 * }));
 * 
 * @example
 * // Chỉ sanitize body
 * app.use(sanitizeInput({ 
 *   sanitizeQuery: false, 
 *   sanitizeParams: false 
 * }));
 */
export function sanitizeInput(options: SanitizeOptions = {}) {
  const {
    whitelist = [],
    sanitizeBody = true,
    sanitizeQuery = true,
    sanitizeParams = true,
    logSanitized = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize req.body
      if (sanitizeBody && req.body) {
        const originalBody = logSanitized ? JSON.stringify(req.body) : null;
        req.body = sanitizeObject(req.body, whitelist);
        
        if (logSanitized && originalBody !== JSON.stringify(req.body)) {
          console.log('[XSS Protection] Sanitized req.body:', {
            path: req.path,
            method: req.method,
            original: originalBody,
            sanitized: JSON.stringify(req.body),
          });
        }
      }

      // Sanitize req.query
      if (sanitizeQuery && req.query) {
        const originalQuery = logSanitized ? JSON.stringify(req.query) : null;
        req.query = sanitizeObject(req.query, whitelist);
        
        if (logSanitized && originalQuery !== JSON.stringify(req.query)) {
          console.log('[XSS Protection] Sanitized req.query:', {
            path: req.path,
            method: req.method,
            original: originalQuery,
            sanitized: JSON.stringify(req.query),
          });
        }
      }

      // Sanitize req.params
      if (sanitizeParams && req.params) {
        const originalParams = logSanitized ? JSON.stringify(req.params) : null;
        req.params = sanitizeObject(req.params, whitelist);
        
        if (logSanitized && originalParams !== JSON.stringify(req.params)) {
          console.log('[XSS Protection] Sanitized req.params:', {
            path: req.path,
            method: req.method,
            original: originalParams,
            sanitized: JSON.stringify(req.params),
          });
        }
      }

      next();
    } catch (error) {
      console.error('[XSS Protection] Error in sanitizeInput middleware:', error);
      // Vẫn cho request đi tiếp để tránh break application
      next();
    }
  };
}

/**
 * Middleware để block request nếu phát hiện XSS attempt
 * Sử dụng khi cần bảo mật cao hơn
 * 
 * @example
 * app.use(blockXssAttempts());
 */
export function blockXssAttempts() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { isXssAttempt } = require('../utils/xss.utils');

    const checkForXss = (obj: any, path: string = ''): boolean => {
      if (typeof obj === 'string') {
        if (isXssAttempt(obj)) {
          console.warn(`[XSS Protection] XSS attempt detected at ${path}:`, obj);
          return true;
        }
      } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (checkForXss(obj[i], `${path}[${i}]`)) {
            return true;
          }
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (checkForXss(obj[key], path ? `${path}.${key}` : key)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // Kiểm tra body, query, params
    if (
      checkForXss(req.body, 'body') ||
      checkForXss(req.query, 'query') ||
      checkForXss(req.params, 'params')
    ) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Invalid input detected. Please check your data.',
      });
    }

    next();
  };
}
