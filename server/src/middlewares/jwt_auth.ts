import { NextFunction, Request, Response } from "express";
import {
  verifyAccessToken,
  AccessTokenPayload,
  isAccessTokenBlacklisted,
  isAccessTokenSuspicious,
} from "../services/jwt";
import { NotAuthorizedError } from "../errors/not_authorized_error";

// UserPayload tương thích với Express.User (có id)
// Không cần override Request.user vì nó đã được định nghĩa là User với id: string

import { ACCESS_TOKEN_COOKIE } from "../utils/cookie_helper";

/**
 * Middleware để verify JWT access token
 * Ưu tiên lấy từ Authorization header, nếu không có thì lấy từ cookie
 * Format header: Authorization: Bearer <token>
 * Cookie name: access_token
 *
 * Security: Kiểm tra blacklist để prevent sử dụng token đã bị revoke
 */
export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    // Ưu tiên lấy token từ Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    }

    // Nếu không có trong header, lấy từ cookie (giống Passport)
    if (!token && req.cookies && req.cookies[ACCESS_TOKEN_COOKIE]) {
      token = req.cookies[ACCESS_TOKEN_COOKIE];
    }

    if (!token) {
      throw new NotAuthorizedError("No token provided");
    }

    // Verify token
    const decoded = verifyAccessToken(token) as AccessTokenPayload;

    // **SECURITY CHECK 1: Kiểm tra xem token có phải là suspicious không**
    // (Token đang chờ xác nhận từ email)
    if (decoded.jti && (await isAccessTokenSuspicious(decoded.jti))) {
      throw new NotAuthorizedError(
        "Token is pending email confirmation. Please check your email and confirm the login."
      );
    }

    // **SECURITY CHECK 2: Kiểm tra xem token có bị blacklist không**
    // (Xảy ra khi detect refresh token reuse hoặc user logout all devices)
    if (decoded.jti && (await isAccessTokenBlacklisted(decoded.jti))) {
      throw new NotAuthorizedError(
        "Token has been revoked. Please login again."
      );
    }

    // Attach user info vào request (UserPayload có id, tương thích với Express.User)
    req.user = decoded as any;

    next();
  } catch (error) {
    if (error instanceof NotAuthorizedError) {
      throw error;
    }

    // Handle JWT errors
    if (error instanceof Error) {
      if (error.message === "Access token expired") {
        throw new NotAuthorizedError("Token expired");
      }
      if (error.message === "Invalid access token") {
        throw new NotAuthorizedError("Invalid token");
      }
    }

    throw new NotAuthorizedError("Authentication failed");
  }
}
