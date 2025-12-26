import { Request, Response, NextFunction } from 'express';
import { CsrfOptions } from '../types/csrf.types';
import {
  getCsrfTokenFromCookie,
  getCsrfTokenFromHeader,
} from '../utils/csrf.utils';
import { BadRequestError } from '../errors/bad_request_error';

/**
 * CSRF Protection Middleware - Double Submit Cookie Pattern
 * 
 * Cách hoạt động:
 * 1. Client lấy CSRF token từ endpoint /csrf-token
 * 2. Token được gửi qua 2 kênh: Cookie (tự động) + Header (thủ công)
 * 3. Middleware so sánh token từ cookie và header
 * 4. Nếu khớp → request hợp lệ, nếu không → reject
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

    // Lấy token từ cookie và header
    const tokenFromCookie = getCsrfTokenFromCookie(req, cookieName);
    const tokenFromHeader = getCsrfTokenFromHeader(req, headerName);

    // Kiểm tra token có tồn tại không
    if (!tokenFromCookie || !tokenFromHeader) {
      throw new BadRequestError('CSRF token missing', 'CSRF_MISSING');
    }

    // So sánh token từ cookie và header (phải khớp nhau)
    if (tokenFromCookie !== tokenFromHeader) {
      throw new BadRequestError('Invalid CSRF token', 'CSRF_INVALID');
    }

    // Token hợp lệ, cho phép request tiếp tục
    next();
  };
}
