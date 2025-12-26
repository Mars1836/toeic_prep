//@ts-nocheck
import { Request, Response } from "express";
import { BadRequestError } from "../../errors/bad_request_error";
import { NotAuthorizedError } from "../../errors/not_authorized_error";
import { constEnv } from "../../configs/const";
import { redis, redisKey } from "../../connect/redis";
import { generateOTP } from "../../utils";
import bcrypt from "bcryptjs";
import {
  sendMailChangePW,
  sendMailVerifyEmail,
  sendSecurityAlertEmail,
} from "../../configs/nodemailer";
import { userModel } from "../../models/user.model";
import mongoose from "mongoose";
import { hashPassword, userSrv } from "../../services/user";
import {
  generateTokenPair,
  generateAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  markRefreshTokenAsUsed,
  generateRefreshToken,
  saveSuspiciousToken,
  activateSuspiciousToken,
  blacklistSuspiciousToken,
  getSuspiciousToken,
} from "../../services/jwt";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
} from "../../utils/cookie_helper";
import {
  generateDeviceFingerprint,
  formatDeviceInfo,
} from "../../services/device_fingerprint";
import {
  saveLoginRecord,
  detectAnomalousLogin,
  trustDevice,
} from "../../services/login_history";
import jwt from "jsonwebtoken";

/**
 * Signup endpoint - tạo user mới và return JWT tokens
 */
async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const user = await userSrv.localCreate({ name, email, password });

  // Generate device fingerprint
  const deviceInfo = generateDeviceFingerprint(req);

  // Generate JWT tokens
  const tokens = await generateTokenPair({
    id: user.id,
    email: user.email!,
  });

  // Set cookies cho client (giống Passport)
  setAccessTokenCookie(res, tokens.accessToken);
  setRefreshTokenCookie(res, tokens.refreshToken);

  // Save login history (first login for new user)
  await saveLoginRecord(user.id, deviceInfo, true);

  // Return user info và tokens
  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    ...tokens,
  });
}

/**
 * Local signup cache - cache thông tin đăng ký vào Redis
 */
async function localSignupCache(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const userEx = await userModel.findOne({ email });
  if (userEx) {
    throw new BadRequestError("Email in use");
  }
  
  const storeStr = JSON.stringify({ name, email, password });
  const key = new mongoose.Types.ObjectId().toString();
  await redis.client.set(key, storeStr, {
    EX: 60 * 60,
  });
  res.status(200).json({ key });
}

/**
 * Login endpoint - xác thực user và return JWT tokens
 * Bao gồm anomaly detection và security alerts
 */
async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // Xác thực user
  const user = await userSrv.localLogin({ email, password });
  console.log(`[Auth] User logged in: ${user.id}`);

  // **SECURITY: Device fingerprinting & anomaly detection**
  const deviceInfo = generateDeviceFingerprint(req);
  const anomalyResult = await detectAnomalousLogin(user.id, deviceInfo);
  console.log(`[Auth] Anomaly result:`, JSON.stringify(anomalyResult));

  // Generate JWT tokens
  const tokens = await generateTokenPair({
    id: user.id,
    email: user.email!,
  });

  // **SECURITY: Nếu login bất thường, lưu token dạng suspicious**
  if (anomalyResult.isAnomalous) {
    console.log(`[Auth] Anomalous login detected, requiring email confirmation.`);
    // Lưu token vào Redis dạng suspicious (chờ xác nhận từ email)
    const tokenId = await saveSuspiciousToken(
      user.id,
      user.email!,
      tokens,
      deviceInfo
    );

    // KHÔNG save login record - chờ xác nhận

    // **NEW Update**: Set cookies ngay lập tức (nhưng token đang ở trạng thái pending/suspicious)
    // Middleware sẽ chặn request dùng token này cho đến khi verified
    console.log(`[Auth] Setting cookies for suspicious login (pending verification)...`);
    setAccessTokenCookie(res, tokens.accessToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    // Gửi email với tokenId để user có thể xác nhận
    sendSecurityAlertEmail(user.email!, {
      userName: user.name || "User",
      loginTime: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "full",
        timeStyle: "long",
      }),
      location: deviceInfo.ip,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ip: deviceInfo.ip,
      reasons: anomalyResult.reasons,
      riskLevel: anomalyResult.riskLevel,
      tokenId, // Token ID để xác nhận
    }).catch((err) => {
      console.error("[Login] Failed to send security alert email:", err);
    });

    // Return response với thông báo cần xác nhận email
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      // KHÔNG return tokens - chờ xác nhận
      requiresEmailConfirmation: true,
      message:
        "We detected unusual login activity. Please check your email to confirm this login.",
      securityAlert: {
        message:
          "We detected unusual activity. Please check your email for details.",
        riskLevel: anomalyResult.riskLevel,
      },
    });
  }

  console.log(`[Auth] Normal login, setting cookies...`);

  // Login bình thường (không có anomaly)
  // Set cookies cho client (giống Passport)
  setAccessTokenCookie(res, tokens.accessToken);
  setRefreshTokenCookie(res, tokens.refreshToken);

  // Save login record to history
  await saveLoginRecord(user.id, deviceInfo, true);

  // Return user info và tokens
  const userRes = user.toObject();
  delete userRes.password;
  res.status(200).json({
    user: userRes,
    ...tokens,
  });
}

/**
 * Refresh token endpoint - tạo access token mới từ refresh token
 * **SECURITY: Token Rotation**
 * - Mỗi lần refresh, tạo refresh token MỚI và revoke token cũ
 * - Nếu token cũ được dùng lại => Token theft detected => Revoke ALL tokens
 */
async function refreshToken(req: Request, res: Response) {
  // Lấy refresh token từ body hoặc cookie
  let refreshToken = req.body.refreshToken;

  // Nếu không có trong body, lấy từ cookie
  if (!refreshToken && req.cookies && req.cookies[REFRESH_TOKEN_COOKIE]) {
    refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
  }

  if (!refreshToken) {
    throw new NotAuthorizedError("Refresh token is required");
  }

  try {
    // Verify refresh token (kiểm tra trong Redis, JWT, và reuse detection)
    const payload = await verifyRefreshToken(refreshToken);

    // Lấy user từ database để đảm bảo user vẫn tồn tại
    const user = await userSrv.getById(payload.id);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    // **CRITICAL STEP: Mark token as used TRƯỚC KHI generate token mới**
    // Nếu có attacker cùng lúc gửi request với cùng token, một trong hai sẽ fail
    await markRefreshTokenAsUsed(payload.id, payload.jti);

    // **TOKEN ROTATION: Generate NEW refresh token**
    const newRefreshToken = await generateRefreshToken({
      id: user.id,
      email: user.email!,
    });

    // Generate access token mới với parentRefreshJti để tracking
    // (Cần decode new refresh token để lấy jti, hoặc return jti từ generateRefreshToken)
    // Để đơn giản, tạm thời không pass parentRefreshJti cho access token khi refresh
    // (Chỉ track access tokens tạo lúc login/signup)
    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email!,
    });

    // Revoke OLD refresh token (đã dùng xong)
    await revokeRefreshToken(payload.id, payload.jti);

    // Set cookies mới cho client
    setAccessTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    // Trả về tokens mới
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    // Handle refresh token errors
    if (error instanceof Error) {
      if (
        error.message === "Refresh token expired" ||
        error.message === "Invalid refresh token" ||
        error.message === "Refresh token not found or expired" ||
        error.message === "Refresh token not found or invalid" ||
        error.message.includes("Refresh token reuse detected")
      ) {
        // Clear cookies vì token không còn valid
        clearAuthCookies(res);
        throw new NotAuthorizedError("Invalid or expired refresh token");
      }
    }
    throw error;
  }
}

/**
 * Logout endpoint - revoke refresh token
 * NOTE: Với system mới, một user có thể có nhiều refresh tokens (multi-device)
 * Hiện tại chỉ revoke token hiện tại. Để logout all devices, cần implement riêng.
 */
async function logout(req: Request, res: Response) {
  // Lấy refresh token từ cookie hoặc body để revoke
  let refreshToken = req.body.refreshToken;
  if (!refreshToken && req.cookies && req.cookies[REFRESH_TOKEN_COOKIE]) {
    refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
  }

  // Nếu có refresh token, revoke nó
  if (refreshToken) {
    try {
      // Decode để lấy jti (không verify, chỉ decode)
      const jwt = require("jsonwebtoken");
      const decoded = jwt.decode(refreshToken) as any;
      if (decoded && decoded.jti) {
        await revokeRefreshToken(req.user!.id, decoded.jti);
      }
    } catch (error) {
      // Ignore errors - user đang logout anyway
      console.log("Error revoking refresh token on logout:", error);
    }
  }

  // Clear cookies
  clearAuthCookies(res);

  res.status(200).json({
    message: "Logged out successfully",
  });
}

/**
 * Get user info - yêu cầu JWT authentication
 */
async function getInfo(req: Request, res: Response) {
  const user = await userSrv.getById(req.user!.id);
  res.json(user);
}

/**
 * Get current user - yêu cầu JWT authentication
 */
async function getCurrentUser(req: Request, res: Response) {
  const user = await userSrv.getById(req.user!.id);
  res.json(user);
}

/**
 * Send OTP for password reset
 */
async function sendResetPasswordOTP(req: Request, res: Response) {
  const otp = generateOTP();
  const { email } = req.body;
  const storeStr = JSON.stringify({ otp, email });
  await redis.client.del(redisKey.resetPwOTPKey(email));
  const set = await redis.client.set(
    redisKey.resetPwOTPKey(email),
    storeStr,
    {
      EX: 5 * 60,
    }
  );

  await sendMailChangePW({ otp: otp, to: email });
  res.status(200).json(1);
}

/**
 * Reset password with OTP
 */
async function resetPassword(req: Request, res: Response) {
  const { password, otp, email } = req.body;

  const storeStr = await redis.client.get(redisKey.resetPwOTPKey(email));
  if (!storeStr) {
    throw new BadRequestError("OTP or email is not valid");
  }
  const store = JSON.parse(storeStr);

  if (store?.email !== email || store?.otp !== otp) {
    throw new BadRequestError("OTP or email is not valid");
  }
  const user = await userModel.findOne({
    email: email,
  });
  if (!user) {
    throw new BadRequestError("Email is not valid");
  }
  const hashPassword = await bcrypt.hash(
    password,
    parseInt(constEnv.passwordSalt!)
  );
  user.set({
    password: hashPassword,
  });
  await user.save();
  redis.client.del(redisKey.resetPwOTPKey(email));
  res.status(200).json(1);
}

/**
 * Send OTP for email verification
 */
async function sendVerifyEmailOTP(req: Request, res: Response) {
  const { key, email } = req.body;
  const storeStr = await redis.client.get(key);
  if (!storeStr) {
    throw new BadRequestError("Some thing wrong with key.");
  }
  const store = JSON.parse(storeStr);
  const otp = generateOTP();
  store.otp = otp;
  redis.client.del(redisKey.verifyEmailKey(email));
  const set = await redis.client.set(
    redisKey.verifyEmailKey(email),
    JSON.stringify(store),
    {
      EX: 5 * 60,
    }
  );
  await sendMailVerifyEmail({ otp: otp, to: email });
  res.status(200).json(1);
}

/**
 * Verify email with OTP
 */
async function verifyEmail(req: Request, res: Response) {
  const { email, otp } = req.body;
  const storeStr = await redis.client.get(redisKey.verifyEmailKey(email));
  if (!storeStr) {
    throw new BadRequestError("Email is not valid");
  }
  const store = JSON.parse(storeStr);
  if (store.otp !== otp) {
    throw new BadRequestError("OTP is not valid");
  }
  if (store.password) {
    store.password = await hashPassword(store.password);
  }
  const user = await userModel.create(store);
  redis.client.del(redisKey.verifyEmailKey(email));

  // Generate JWT tokens sau khi verify email thành công
  const tokens = await generateTokenPair({
    id: user.id,
    email: user.email!,
  });

  // Set cookies cho client (giống Passport)
  setAccessTokenCookie(res, tokens.accessToken);
  setRefreshTokenCookie(res, tokens.refreshToken);

  // Return user info và tokens
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    ...tokens,
  });
}

/**
 * Confirm suspicious login (user clicks "Yes, this was me" in email)
 * POST /api/user/auth/security/confirm-login
 * Body: { tokenId: string }
 */
async function confirmLogin(req: Request, res: Response) {
  const { tokenId } = req.body;

  // Lấy suspicious token data để lấy userId
  // Cần tìm trong Redis bằng cách scan pattern (vì không biết userId)
  let userId: string | null = null;
  const { email } = req.body;
  
  // Nếu có email thì tìm theo email (nhanh hơn)
  if (email) {
    const user = await userModel.findOne({ email });
    if (user) userId = user.id;
  }

  // Nếu không có email (trường hợp click link), scan Redis tìm userId từ tokenId
  if (!userId) {
     const pattern = `suspicious_token:*:${tokenId}`;
     const keys = await redis.client.keys(pattern);
     if (keys.length > 0) {
       // Key format: suspicious_token:{userId}:{tokenId}
       const parts = keys[0].split(":");
       if (parts.length === 3) {
         userId = parts[1];
       }
     }
  }

  if (!userId) {
     throw new BadRequestError("Token confirmation link expired or invalid");
  }
  console.log("userId", userId);
  console.log("tokenId", tokenId);
  
  const user = await userSrv.getById(userId);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  // Lấy thông tin suspicious token TRƯỚC KHI activate (vì activate sẽ xóa nó)
  const suspiciousData = await getSuspiciousToken(user.id, tokenId);
  if (!suspiciousData) {
    throw new BadRequestError("Token confirmation link expired or invalid");
  }

  // Kích hoạt suspicious token
  const tokens = await activateSuspiciousToken(user.id, tokenId);

  // Trust device (lưu vào login history)
  // Bây giờ suspiciousData đã có dữ liệu
  if (suspiciousData.deviceInfo) {
    await trustDevice(user.id, suspiciousData.deviceInfo);
  }

  // Set cookies cho client
  setAccessTokenCookie(res, tokens.accessToken);
  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    message: "Login confirmed successfully",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
    ...tokens,
  });
}

/**
 * Reject suspicious login (user clicks "No, secure my account" in email)
 * POST /api/user/auth/security/reject-login
 * Body: { tokenId: string, email?: string }
 */
async function rejectLogin(req: Request, res: Response) {
  const { tokenId, email } = req.body;

  // Tìm user từ email hoặc từ tokenId
  let userId: string | null = null;

  if (email) {
    const user = await userModel.findOne({ email });
    if (user) {
      userId = user.id;
    }
  }

  // Nếu không có email, scan Redis để tìm (chậm hơn nhưng vẫn work)
  if (!userId) {
    const pattern = `suspicious_token:*:${tokenId}`;
    const keys = await redis.client.keys(pattern);
    if (keys.length > 0) {
      const parts = keys[0].split(":");
      if (parts.length === 3) {
        userId = parts[1]; // suspicious_token:{userId}:{tokenId}
      }
    }
  }

  if (!userId) {
    throw new BadRequestError("Token not found or already expired");
  }

  // Blacklist suspicious token
  await blacklistSuspiciousToken(userId, tokenId);

  // Revoke all user tokens (bảo mật tài khoản)
  const { revokeAllUserTokens } = await import("../../services/jwt");
  await revokeAllUserTokens(userId);

  res.status(200).json({
    message:
      "Login rejected. All sessions have been revoked. Please change your password immediately.",
    requiresPasswordChange: true,
  });
}

/**

 * Cách tấn công:
 * POST /api/user/auth/login-demo-vulnerable
 * Body: {
 *   "email": {"$ne": null},
 *   "password": {"$ne": null}
 * }
 * 
 * Điểm khác biệt với login() bình thường:
 * - login() có validation: body("email").isEmail() - CHỈ CHẤP NHẬN STRING
 * - loginDemoVulnerable() KHÔNG có validation - CHẤP NHẬN OBJECT
 */
async function loginDemoVulnerable(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Detect injection attempt
    const isInjectionAttempt = typeof email === 'object' || typeof password === 'object';

    const user = await userModel.findOne({
      email: email,
    });


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Sai email hoặc password",
      });
    }

    if (isInjectionAttempt) {
      // Generate tokens (giống login bình thường)
      const deviceInfo = generateDeviceFingerprint(req);
      const tokens = await generateTokenPair({
        id: user.id,
        email: user.email!,
      });

      setAccessTokenCookie(res, tokens.accessToken);
      setRefreshTokenCookie(res, tokens.refreshToken);

      // Save login record
      await saveLoginRecord(user.id, deviceInfo, true);

      return res.json({
        success: true,
        message: "Login thành công",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        ...tokens,
      });
    }

    // Normal flow: Check password nếu không phải injection
    if (typeof password !== 'string') {
      return res.status(401).json({
        success: false,
        message: "Sai email hoặc password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Sai email hoặc password"
      });
    }

    // Generate tokens (login bình thường)
    const deviceInfo = generateDeviceFingerprint(req);
    const tokens = await generateTokenPair({
      id: user.id,
      email: user.email!,
    });

    setAccessTokenCookie(res, tokens.accessToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    await saveLoginRecord(user.id, deviceInfo, true);

    res.json({
      success: true,
      message: "Login thành công (bình thường)",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      ...tokens
    });
  } catch (error: any) {
    console.error("Error in loginDemoVulnerable:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
}

export const userAuthCtrl = {
  signup,
  localSignupCache,
  login,
  refreshToken,
  logout,
  getInfo,
  getCurrentUser,
  sendResetPasswordOTP,
  resetPassword,
  sendVerifyEmailOTP,
  verifyEmail,
  confirmLogin,
  rejectLogin,
  loginDemoVulnerable,  // ⚠️ DEMO ONLY
};
