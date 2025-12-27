import { Request, Response, NextFunction } from "express";
import { requireAuth } from "./require_auth";

/**
 * Middleware for authenticating static file requests
 * Reuses requireAuth middleware from API routes
 * 
 * Supports:
 * - Authorization header (fetch/axios)
 * - access_token cookie (img/audio tags)
 * - session JWT (legacy)
 */
export const staticFileAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Nếu có access_token cookie, inject vào Authorization header
    // để requireAuth có thể xử lý
    if (!req.headers.authorization && req.cookies?.access_token) {
      req.headers.authorization = `Bearer ${req.cookies.access_token}`;
    }
    
    // Nếu có session JWT (legacy), inject vào Authorization header
    if (!req.headers.authorization && req.session?.jwt) {
      req.headers.authorization = `Bearer ${req.session.jwt}`;
    }

    // Dùng lại requireAuth middleware của API
    await requireAuth(req, res, next);
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required to access this resource"
    });
  }
};
