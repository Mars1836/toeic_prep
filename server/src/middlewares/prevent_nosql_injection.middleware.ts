import { Request, Response, NextFunction } from 'express';
import {
  hasNoSqlInjectionInKeys,
  getInjectionDetails,
  sanitizeNoSqlObject,
  hasDangerousOperators,
} from '../utils/nosql_injection.utils';
import { NoSqlInjectionError } from '../errors/nosql_injection_error';

/**
 * Middleware Options
 */
export interface PreventNoSqlInjectionOptions {
  /**
   * Mode hoạt động:
   * - 'block': Reject request nếu phát hiện injection (bảo mật cao)
   * - 'sanitize': Tự động loại bỏ keys nguy hiểm (ít gián đoạn)
   * 
   * Mặc định: 'block'
   */
  mode?: 'block' | 'sanitize';

  /**
   * Có log các injection attempts không
   * Mặc định: true
   */
  logAttempts?: boolean;

  /**
   * Có kiểm tra req.body không
   * Mặc định: true
   */
  checkBody?: boolean;

  /**
   * Có kiểm tra req.query không
   * Mặc định: true
   */
  checkQuery?: boolean;

  /**
   * Có kiểm tra req.params không
   * Mặc định: true
   */
  checkParams?: boolean;
}

/**
 * Middleware để bảo vệ chống NoSQL Injection
 * Kiểm tra và chặn các ký tự nguy hiểm ($, .) trong object keys
 * 
 * @param options - Cấu hình cho middleware
 * @returns Express middleware function
 * 
 * @example
 * // Sử dụng với mode block (mặc định)
 * app.use(preventNoSqlInjection());
 * 
 * @example
 * // Sử dụng với mode sanitize
 * app.use(preventNoSqlInjection({ mode: 'sanitize' }));
 * 
 * @example
 * // Chỉ kiểm tra body
 * app.use(preventNoSqlInjection({ 
 *   checkQuery: false, 
 *   checkParams: false 
 * }));
 */
export function preventNoSqlInjection(
  options: PreventNoSqlInjectionOptions = {}
) {
  const {
    mode = 'block',
    logAttempts = true,
    checkBody = true,
    checkQuery = true,
    checkParams = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const injectedKeys: string[] = [];
      let hasInjection = false;

      // Kiểm tra req.body
      if (checkBody && req.body) {
        if (hasNoSqlInjectionInKeys(req.body)) {
          hasInjection = true;
          const bodyKeys = getInjectionDetails(req.body);
          injectedKeys.push(...bodyKeys.map((k) => `body.${k}`));

          if (mode === 'sanitize') {
            req.body = sanitizeNoSqlObject(req.body);
          }
        }
      }

      // Kiểm tra req.query
      if (checkQuery && req.query) {
        if (hasNoSqlInjectionInKeys(req.query)) {
          hasInjection = true;
          const queryKeys = getInjectionDetails(req.query);
          injectedKeys.push(...queryKeys.map((k) => `query.${k}`));

          if (mode === 'sanitize') {
            req.query = sanitizeNoSqlObject(req.query);
          }
        }
      }

      // Kiểm tra req.params
      if (checkParams && req.params) {
        if (hasNoSqlInjectionInKeys(req.params)) {
          hasInjection = true;
          const paramsKeys = getInjectionDetails(req.params);
          injectedKeys.push(...paramsKeys.map((k) => `params.${k}`));

          if (mode === 'sanitize') {
            req.params = sanitizeNoSqlObject(req.params);
          }
        }
      }

      // Nếu phát hiện injection
      if (hasInjection) {
        // Log injection attempt
        if (logAttempts) {
          console.warn('[NoSQL Injection Protection] Injection attempt detected:', {
            timestamp: new Date().toISOString(),
            ip: req.ip || req.socket.remoteAddress,
            method: req.method,
            path: req.path,
            userAgent: req.get('user-agent'),
            injectedKeys,
            mode,
          });
        }

        // Nếu mode là block, reject request
        if (mode === 'block') {
          throw new NoSqlInjectionError(injectedKeys);
        }

        // Nếu mode là sanitize, log và tiếp tục
        if (mode === 'sanitize' && logAttempts) {
          console.log('[NoSQL Injection Protection] Request sanitized, continuing...');
        }
      }

      next();
    } catch (error) {
      // Nếu là NoSqlInjectionError, pass to error handler
      if (error instanceof NoSqlInjectionError) {
        next(error);
        return;
      }

      // Các lỗi khác, log và cho request đi tiếp
      console.error('[NoSQL Injection Protection] Unexpected error:', error);
      next();
    }
  };
}

/**
 * Middleware nâng cao: Kiểm tra cả dangerous MongoDB operators
 * Sử dụng khi cần bảo mật cực cao
 * 
 * @example
 * app.use(preventNoSqlInjectionStrict());
 */
export function preventNoSqlInjectionStrict(
  options: PreventNoSqlInjectionOptions = {}
) {
  const {
    mode = 'block',
    logAttempts = true,
    checkBody = true,
    checkQuery = true,
    checkParams = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const injectedKeys: string[] = [];
      let hasInjection = false;

      // Helper function để kiểm tra cả keys và operators
      const checkForInjection = (obj: any, prefix: string) => {
        if (hasNoSqlInjectionInKeys(obj) || hasDangerousOperators(obj)) {
          hasInjection = true;
          const keys = getInjectionDetails(obj);
          injectedKeys.push(...keys.map((k) => `${prefix}.${k}`));
          return true;
        }
        return false;
      };

      // Kiểm tra req.body
      if (checkBody && req.body) {
        if (checkForInjection(req.body, 'body')) {
          if (mode === 'sanitize') {
            req.body = sanitizeNoSqlObject(req.body);
          }
        }
      }

      // Kiểm tra req.query
      if (checkQuery && req.query) {
        if (checkForInjection(req.query, 'query')) {
          if (mode === 'sanitize') {
            req.query = sanitizeNoSqlObject(req.query);
          }
        }
      }

      // Kiểm tra req.params
      if (checkParams && req.params) {
        if (checkForInjection(req.params, 'params')) {
          if (mode === 'sanitize') {
            req.params = sanitizeNoSqlObject(req.params);
          }
        }
      }

      // Nếu phát hiện injection
      if (hasInjection) {
        if (logAttempts) {
          console.warn('[NoSQL Injection Protection - STRICT] Injection attempt detected:', {
            timestamp: new Date().toISOString(),
            ip: req.ip || req.socket.remoteAddress,
            method: req.method,
            path: req.path,
            userAgent: req.get('user-agent'),
            injectedKeys,
            mode,
          });
        }

        if (mode === 'block') {
          throw new NoSqlInjectionError(injectedKeys);
        }
      }

      next();
    } catch (error) {
      if (error instanceof NoSqlInjectionError) {
        next(error);
        return;
      }

      console.error('[NoSQL Injection Protection - STRICT] Unexpected error:', error);
      next();
    }
  };
}
