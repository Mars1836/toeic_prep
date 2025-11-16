import { Response } from "express";
import { constEnv } from "../configs/const";

// Cookie names
export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

/**
 * Parse time format string (e.g., "7d", "1h", "30m", "90s") to milliseconds
 * Giống như parseTimeToSeconds nhưng trả về milliseconds cho cookie maxAge
 */
function parseTimeToMilliseconds(timeStr: string): number {
  const match = timeStr.match(/^(\d+)([smhd])$/i);
  if (!match) {
    // Default fallback
    return 15 * 60 * 1000; // 15 minutes
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return value * 1000; // seconds to milliseconds
    case "m":
      return value * 60 * 1000; // minutes to milliseconds
    case "h":
      return value * 60 * 60 * 1000; // hours to milliseconds
    case "d":
      return value * 24 * 60 * 60 * 1000; // days to milliseconds
    default:
      return 15 * 60 * 1000; // Default: 15 minutes
  }
}

// Get cookie options based on environment
function getCookieOptions() {
  const env = process.env.APP_ENV;
  const isProduction = env === "prod" || env === "docker";

  return {
    httpOnly: true, // Prevent XSS attacks
    secure: isProduction, // Only send over HTTPS in production
    sameSite: isProduction ? ("none" as const) : ("lax" as const), // CSRF protection
    // domain: undefined, // Use default domain
    // path: "/", // Available for all paths
  };
}

/**
 * Set access token cookie
 * TTL từ config JWT_ACCESS_TOKEN_TTL (default: 15m)
 */
export function setAccessTokenCookie(res: Response, token: string): void {
  const options = getCookieOptions();

  // Access token TTL từ config (default: "15m")
  const accessTokenTTL = constEnv.jwtAccessTokenTTL || "15m";
  const maxAge = parseTimeToMilliseconds(accessTokenTTL);

  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    ...options,
    maxAge,
  });
}

/**
 * Set refresh token cookie
 * TTL từ config JWT_REFRESH_TOKEN_TTL (default: 7d)
 */
export function setRefreshTokenCookie(res: Response, token: string): void {
  const options = getCookieOptions();

  // Refresh token TTL từ config (default: "7d")
  const refreshTokenTTL = constEnv.jwtRefreshTokenTTL || "7d";
  const maxAge = parseTimeToMilliseconds(refreshTokenTTL);

  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    ...options,
    maxAge,
  });
}

/**
 * Clear access token cookie
 */
export function clearAccessTokenCookie(res: Response): void {
  const options = getCookieOptions();
  res.clearCookie(ACCESS_TOKEN_COOKIE, options);
}

/**
 * Clear refresh token cookie
 */
export function clearRefreshTokenCookie(res: Response): void {
  const options = getCookieOptions();
  res.clearCookie(REFRESH_TOKEN_COOKIE, options);
}

/**
 * Clear all auth cookies
 */
export function clearAuthCookies(res: Response): void {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
}
