import crypto from 'crypto';
import { Request, Response } from 'express';
import { constEnv } from '../configs/const';

/**
 * Get CSRF secret from environment or use default
 */
function getCsrfSecret(): string {
  return process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
}

/**
 * Generate a signed CSRF token with HMAC signature
 * Format: {randomToken}.{signature}
 * @param length - Token length in bytes (default: 32)
 * @returns Signed token string
 */
export function generateCsrfToken(length: number = 32): string {
  const token = crypto.randomBytes(length).toString('hex');
  const signature = crypto
    .createHmac('sha256', getCsrfSecret())
    .update(token)
    .digest('hex');
  
  return `${token}.${signature}`;
}

/**
 * Verify CSRF token signature
 * @param signedToken - Token with signature (format: token.signature)
 * @returns true if signature is valid, false otherwise
 */
export function verifyCsrfToken(signedToken: string): boolean {
  if (!signedToken || typeof signedToken !== 'string') {
    return false;
  }

  const parts = signedToken.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [token, signature] = parts;
  if (!token || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', getCsrfSecret())
    .update(token)
    .digest('hex');

  // Timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
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
  res.cookie(cookieName, token, {
    httpOnly: false, // JavaScript cần đọc được để gửi qua header
    secure: true, // HTTPS only (ngrok luôn dùng HTTPS)
    sameSite: 'none' as const, // Cross-origin support (client khác domain)
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
