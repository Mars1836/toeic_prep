import { Request, Response, NextFunction } from "express";
import { handleAsync } from "./handle_async";
import { jwtAuth } from "./jwt_auth";
import { requireAuth } from "./require_auth";

/**
 * Middleware for authenticating static file requests
 * Supports JWT (Authorization header), cookie-based auth, and access_token cookie
 * 
 * Use case: Protect static files while allowing <img>, <audio> tags to work (via cookies)
 */
export const staticFileAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check 1: Authorization header (for API calls with fetch/axios)
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      // Use JWT auth middleware
      return handleAsync(jwtAuth)(req, res, () => {
        return handleAsync(requireAuth)(req, res, next);
      });
    }

    // Check 2: access_token cookie (for <audio>, <img> tags - automatically sent by browser)
    const accessTokenCookie = req.cookies?.access_token;
    
    if (accessTokenCookie) {
      // Inject JWT into Authorization header
      req.headers.authorization = `Bearer ${accessTokenCookie}`;
      
      return handleAsync(jwtAuth)(req, res, () => {
        return handleAsync(requireAuth)(req, res, next);
      });
    }

    // Check 3: Cookie session (for legacy support)
    if (req.session?.jwt) {
      // Inject JWT into Authorization header
      req.headers.authorization = `Bearer ${req.session.jwt}`;
      
      return handleAsync(jwtAuth)(req, res, () => {
        return handleAsync(requireAuth)(req, res, next);
      });
    }

    // No authentication found
    res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required to access this resource"
    });
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid authentication"
    });
  }
};
