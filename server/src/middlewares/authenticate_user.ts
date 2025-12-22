import { NextFunction, Request, Response } from "express";
import { jwtAuth } from "./jwt_auth";
import { requireAuth } from "./require_auth";

/**
 * Middleware kết hợp để authenticate user với JWT
 * Tương đương với jwtAuth + requireAuth
 */
export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Verify JWT token
  await jwtAuth(req, res, () => {
    // Sau khi verify JWT thành công, kiểm tra user
    requireAuth(req, res, next);
  });
}

