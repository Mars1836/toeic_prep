import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not_authorized_error";
import { jwtAuth } from "./jwt_auth";

/**
 * Middleware để yêu cầu authentication
 * Tự động verify JWT token từ Authorization header hoặc cookie (giống Passport)
 * Sử dụng JWT authentication (không còn dùng Passport session)
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Nếu chưa có user, thử verify JWT token từ header hoặc cookie
  if (!req.user) {
    const authHeader = req.headers.authorization;
    const hasAuthHeader = authHeader && authHeader.startsWith("Bearer ");
    const hasCookie = req.cookies && req.cookies.access_token;
    
    // Nếu có Authorization header hoặc cookie, thử verify JWT
    if (hasAuthHeader || hasCookie) {
      try {
        await jwtAuth(req, res, () => {
          // JWT verified, continue
        });
      } catch (error) {
        // JWT verification failed
        if (error instanceof NotAuthorizedError) {
          throw error;
        }
        throw new NotAuthorizedError("Invalid or expired token");
      }
    }
  }

  // Kiểm tra lại sau khi verify JWT
  if (!req.user) {
    throw new NotAuthorizedError("Authentication required");
  }

  return next();
}
