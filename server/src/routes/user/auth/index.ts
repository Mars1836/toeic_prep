//@ts-nocheck
import express from "express";
import { userAuthCtrl } from "../../../controllers/user";
import { handleAsync } from "../../../middlewares/handle_async";
import { requireAuth } from "../../../middlewares/require_auth";
import { jwtAuth } from "../../../middlewares/jwt_auth";
import { validate_request } from "../../../middlewares/validate_request";
import { body } from "express-validator";

const userAuthRouter = express.Router();

// Test endpoint - yêu cầu JWT authentication
userAuthRouter.get(
  "/login",
  (req, res) => {
    res.json("Test success");
  }
);

// Signup endpoint - tạo user mới và return JWT tokens
userAuthRouter.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 50 })
      .withMessage("Password must be between 4 and 50 characters"),
  ],
  handleAsync(userAuthCtrl.signup)
);

// Local signup cache - cache thông tin đăng ký vào Redis
userAuthRouter.post(
  "/local-signup-cache",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 50 })
      .withMessage("Password must be between 4 and 50 characters"),
  ],
  handleAsync(userAuthCtrl.localSignupCache)
);

// Login endpoint - xác thực user và return JWT tokens
userAuthRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  handleAsync(validate_request),
  handleAsync(userAuthCtrl.login)
);

// Refresh token endpoint - tạo access token mới từ refresh token
// POST /api/user/auth/refresh
// Body: { "refreshToken": "..." } (optional, có thể lấy từ cookie)
// Response: { "accessToken": "...", "refreshToken": "..." }
//
// **SECURITY: Token Rotation**
// - Mỗi lần refresh, tạo refresh token MỚI và revoke token cũ
// - Nếu token cũ được dùng lại => Token theft detected => Revoke ALL tokens
userAuthRouter.post(
  "/refresh",
  handleAsync(userAuthCtrl.refreshToken)
);

// Logout endpoint - revoke refresh token
// NOTE: Với system mới, một user có thể có nhiều refresh tokens (multi-device)
// Hiện tại chỉ revoke token hiện tại. Để logout all devices, cần implement riêng.
userAuthRouter.post(
  "/logout",
  handleAsync(jwtAuth),
  handleAsync(requireAuth),
  handleAsync(userAuthCtrl.logout)
);

// Get user info - yêu cầu JWT authentication
userAuthRouter.get(
  "/getinfor",
  handleAsync(jwtAuth),
  handleAsync(requireAuth),
  handleAsync(userAuthCtrl.getInfo)
);

// Get current user - yêu cầu JWT authentication
userAuthRouter.get(
  "/current-user",
  handleAsync(jwtAuth),
  handleAsync(requireAuth),
  handleAsync(userAuthCtrl.getCurrentUser)
);

// Send OTP for password reset
userAuthRouter.post(
  "/otp/reset-password",
  [body("email").isEmail().withMessage("Email is not provided or valid!")],
  handleAsync(validate_request),
  handleAsync(userAuthCtrl.sendResetPasswordOTP)
);

// Reset password with OTP
userAuthRouter.post(
  "/request/reset-password",
  [
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("otp").trim().notEmpty().withMessage("OTP is required"),
  ],
  handleAsync(userAuthCtrl.resetPassword)
);

// Send OTP for email verification
userAuthRouter.post(
  "/otp/verify-email",
  [
    body("key").notEmpty().withMessage("Key is required"),
    body("email").isEmail().withMessage("Email is required"),
  ],
  handleAsync(validate_request),
  handleAsync(userAuthCtrl.sendVerifyEmailOTP)
);

// Verify email with OTP
userAuthRouter.post(
  "/request/verify-email",
  [
    body("otp").notEmpty().withMessage("OTP is required"),
    body("email").isEmail().withMessage("Email is required"),
  ],
  handleAsync(validate_request),
  handleAsync(userAuthCtrl.verifyEmail)
);

// ==================== SECURITY ENDPOINTS ====================

/**
 * Confirm suspicious login (user clicks "Yes, this was me" in email)
 * POST /api/user/auth/security/confirm-login
 * Body: { tokenId: string }
 */
userAuthRouter.post(
  "/security/confirm-login",
  [
    body("tokenId").notEmpty().withMessage("Token ID is required"),
  ],
  handleAsync(validate_request),
  handleAsync(userAuthCtrl.confirmLogin)
);

/**
 * Reject suspicious login (user clicks "No, secure my account" in email)
 * POST /api/user/auth/security/reject-login
 * Body: { tokenId: string, email?: string }
 */
userAuthRouter.post(
  "/security/reject-login",
  [
    body("tokenId").notEmpty().withMessage("Token ID is required"),
  ],
  handleAsync(validate_request),
  handleAsync(userAuthCtrl.rejectLogin)
);

export default userAuthRouter;
