import { validationResult } from "express-validator";
import { UserAttr, userModel } from "../../models/user.model";
import { Request, Response } from "express";
import { RequestValidationError } from "../../errors/request_validation_error";
import { NotAuthorizedError } from "../../errors/not_authorized_error";
import { BadRequestError } from "../../errors/bad_request_error";
import { adminLocalCreate, adminLocalLogin } from "../../services/admin";
import {
  generateTokenPair,
  verifyRefreshToken,
  revokeRefreshToken,
  markRefreshTokenAsUsed,
  generateRefreshToken,
  generateAccessToken,
} from "../../services/jwt";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
} from "../../utils/cookie_helper";

export namespace AdminCtrl {
  /**
   * Admin login - JWT authentication (giống user)
   */
  export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // Authenticate admin
    const admin = await adminLocalLogin({ email, password });
    
    // Generate JWT tokens với role admin
    const tokens = await generateTokenPair({
      id: admin.id,
      email: admin.email!,
      role: 'admin', // ← Important!
    });
    
    // Set cookies
    setAccessTokenCookie(res, tokens.accessToken);
    setRefreshTokenCookie(res, tokens.refreshToken);
    
    // Return response
    res.status(200).json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
      ...tokens,
    });
  }

  /**
   * Refresh token - dùng lại logic user
   */
  export async function refreshToken(req: Request, res: Response) {
    let refreshToken = req.body.refreshToken;
    
    if (!refreshToken && req.cookies && req.cookies[REFRESH_TOKEN_COOKIE]) {
      refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    }
    
    if (!refreshToken) {
      throw new NotAuthorizedError("Refresh token is required");
    }
    
    try {
      const payload = await verifyRefreshToken(refreshToken);
      
      // Mark as used
      await markRefreshTokenAsUsed(payload.id, payload.jti);
      
      // Generate new tokens
      const newRefreshToken = await generateRefreshToken({
        id: payload.id,
        email: payload.email,
        //ts-ignore
        role: payload.role
      });
      
      const newAccessToken = generateAccessToken({
        id: payload.id,
        email: payload.email,
        //ts-ignore
        role: payload.role 
      });
      
      // Revoke old token
      await revokeRefreshToken(payload.id, payload.jti);
      
      // Set new cookies
      setAccessTokenCookie(res, newAccessToken);
      setRefreshTokenCookie(res, newRefreshToken);
      
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      clearAuthCookies(res);
      throw new NotAuthorizedError("Invalid or expired refresh token");
    }
  }

  /**
   * Logout - dùng lại logic user
   */
  export async function logout(req: Request, res: Response) {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken && req.cookies && req.cookies[REFRESH_TOKEN_COOKIE]) {
      refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    }
    
    if (refreshToken) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.decode(refreshToken) as any;
        if (decoded && decoded.jti) {
          //ts-ignore
          await revokeRefreshToken(decoded.id, decoded.jti);
        }
      } catch (error) {
        console.log("Error revoking refresh token on logout:", error);
      }
    }
    
    clearAuthCookies(res);
    
    res.status(200).json({
      message: "Logged out successfully",
    });
  }

  /**
   * Register admin
   */
  export async function localRegister(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password, name } = req.body;
    const user = await adminLocalCreate({ email, password, name });
    res.status(200).json(user);
  }

  /**
   * Get current admin
   */
  export async function getCurrentUser(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw new NotAuthorizedError();
    }
    res.status(200).json(user);
  }
}
