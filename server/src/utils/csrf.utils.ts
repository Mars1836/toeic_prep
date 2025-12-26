import crypto from 'crypto';
import { Request, Response } from 'express';

/**
 * Generate a random CSRF token
 * @param length - Token length in bytes (default: 32)
 * @returns Hex string token
 */
export function generateCsrfToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Set CSRF token as cookie
 * @param res - Express Response object
 * @param token - CSRF token
 * @param cookieName - Cookie name (default: XSRF-TOKEN)
 */
export function setCsrfCookie(
  res: Response,
  token: string,
  cookieName: string = 'XSRF-TOKEN'
): void {
  const env = process.env.APP_ENV;
  
  res.cookie(cookieName, token, {
    httpOnly: false, // JavaScript cần đọc được để gửi qua header
    secure: env === 'prod', // HTTPS only trong production
    sameSite: env === 'prod' ? 'none' : 'lax', // Cross-origin support
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Get CSRF token from cookie
 * @param req - Express Request object
 * @param cookieName - Cookie name (default: XSRF-TOKEN)
 * @returns CSRF token or undefined
 */
export function getCsrfTokenFromCookie(
  req: Request,
  cookieName: string = 'XSRF-TOKEN'
): string | undefined {
  return req.cookies?.[cookieName];
}

/**
 * Get CSRF token from header
 * @param req - Express Request object
 * @param headerName - Header name (default: x-csrf-token)
 * @returns CSRF token or undefined
 */
export function getCsrfTokenFromHeader(
  req: Request,
  headerName: string = 'x-csrf-token'
): string | undefined {
  return req.headers[headerName.toLowerCase()] as string | undefined;
}

/**
 * Set CSRF token as response header
 * @param res - Express Response object
 * @param token - CSRF token
 * @param headerName - Header name (default: X-CSRF-Token)
 */
export function setCsrfHeader(
  res: Response,
  token: string,
  headerName: string = 'X-CSRF-Token'
): void {
  res.setHeader(headerName, token);
}
