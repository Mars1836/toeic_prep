import { Request, Response, NextFunction } from 'express';
import { CsrfOptions } from '../types/csrf.types';
import {
  getCsrfTokenFromCookie,
  getCsrfTokenFromHeader,
  verifyCsrfToken,
} from '../utils/csrf.utils';
import { BadRequestError } from '../errors/bad_request_error';

/**
 * CSRF Protection Middleware - Double Submit Cookie Pattern with Signed Tokens
 * 
 * Cách hoạt động:
 * 1. Client lấy CSRF token từ endpoint /csrf-token
 * 2. Token được gửi qua 2 kênh: Cookie (tự động) + Header (thủ công)
 * 3. Middleware verify signature của token (HMAC-SHA256)
 * 4. So sánh token từ cookie và header
 * 5. Nếu khớp → request hợp lệ, nếu không → reject
 * 
 * @param options - CSRF configuration options
 */
export function csrfProtection(options: CsrfOptions = {}) {
  const {
    whitelist = [],
    cookieName = 'XSRF-TOKEN',
    headerName = 'x-csrf-token',
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF check cho GET, HEAD, OPTIONS (safe methods)
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      return next();
    }

    // Skip CSRF check cho whitelisted routes
    const isWhitelisted = whitelist.some((path) => req.path.startsWith(path));
    if (isWhitelisted) {
      return next();
    }

    // ============================================
    // SKIP CSRF CHO MOBILE APP (FLUTTER/DART)
    // ============================================
    const userAgent = req.headers['user-agent'] || '';
    const isMobileApp = 
      userAgent.includes('Dart/') || 
      userAgent.includes('Flutter') ||
      req.headers['x-app-platform'] === 'flutter' ||
      req.headers['x-app-platform'] === 'mobile';
    
    if (isMobileApp) {
      return next();
    }

    // ============================================
    // VALIDATE CSRF TOKEN CHO WEBSITE
    // ============================================
    const tokenFromCookie = getCsrfTokenFromCookie(req, cookieName);
    const tokenFromHeader = getCsrfTokenFromHeader(req, headerName);

    if (!tokenFromCookie || !tokenFromHeader) {
      throw new BadRequestError('CSRF token missing', 'CSRF_MISSING');
    }

    // SECURITY: Verify signature của token từ cookie
    // Ngăn chặn attacker tự set cookie với giá trị bất kỳ
    if (!verifyCsrfToken(tokenFromCookie)) {
      throw new BadRequestError('Invalid CSRF token signature', 'CSRF_INVALID_SIGNATURE');
    }

    // So sánh token từ cookie và header (phải khớp nhau)
    if (tokenFromCookie !== tokenFromHeader) {
      throw new BadRequestError('CSRF token mismatch', 'CSRF_MISMATCH');
    }

    // Token hợp lệ, cho phép request tiếp tục
    next();
  };
}
