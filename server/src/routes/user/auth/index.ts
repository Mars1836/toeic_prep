//@ts-nocheck
import express, { Request, Response } from "express";
import { userCtrl } from "../../../controllers/user";
import { handleAsync } from "../../../middlewares/handle_async";
import { requireAuth } from "../../../middlewares/require_auth";
import { jwtAuth } from "../../../middlewares/jwt_auth";
import { BadRequestError } from "../../../errors/bad_request_error";
import { NotAuthorizedError } from "../../../errors/not_authorized_error";
import { constEnv } from "../../../configs/const";
import { validate_request } from "../../../middlewares/validate_request";
import { body } from "express-validator";
import { redis, redisKey } from "../../../connect/redis";
import { delay, generateOTP } from "../../../utils";
import bcrypt from "bcryptjs";

import {
  sendMailChangePW,
  sendMailVerifyEmail,
} from "../../../configs/nodemailer";
import { userModel } from "../../../models/user.model";

import mongoose from "mongoose";
import { hashPassword, userSrv } from "../../../services/user";
import {
  generateTokenPair,
  generateAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  markRefreshTokenAsUsed,
  generateRefreshToken,
} from "../../../services/jwt";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
} from "../../../utils/cookie_helper";

const userAuthRouter = express.Router();

// Test endpoint - yêu cầu JWT authentication
userAuthRouter.get(
  "/login",
  handleAsync(jwtAuth),
  handleAsync(requireAuth),
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
  handleAsync(async function (req: Request, res: Response) {
    const { name, email, password } = req.body;
    const user = await userSrv.localCreate({ name, email, password });

    // Generate JWT tokens
    const tokens = await generateTokenPair({
      id: user.id,
      email: user.email!,
    });

    // Set cookies cho client (giống Passport)
    setAccessTokenCookie(res, tokens.accessToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    // Return user info và tokens
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    });
  })
);
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
  handleAsync(async function (req: Request, res: Response) {
    const { name, email, password } = req.body;
    const userEx = await userModel.findOne({ email });
    if (userEx) {
      throw new BadRequestError("Email in use");
    }
    // const user = await userSrv.localCreate({ name, email, password });
    // res.status(200).json(user);
    const storeStr = JSON.stringify({ name, email, password });
    const key = new mongoose.Types.ObjectId().toString();
    await redis.client.set(key, storeStr, {
      EX: 60 * 60,
    });
    res.status(200).json({ key });
  })
);
// Login endpoint - xác thực user và return JWT tokens
userAuthRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  handleAsync(validate_request),
  handleAsync(async function (req: Request, res: Response) {
    const { email, password } = req.body;

    // Xác thực user
    const user = await userSrv.localLogin({ email, password });

    // Generate JWT tokens
    const tokens = await generateTokenPair({
      id: user.id,
      email: user.email!,
    });

    // Set cookies cho client (giống Passport)
    setAccessTokenCookie(res, tokens.accessToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    // Return user info và tokens (có thể return hoặc không, cookie đã được set)
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      ...tokens,
    });
  })
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
  // Refresh token có thể từ body hoặc cookie, không bắt buộc validate
  handleAsync(async function (req: Request, res: Response) {
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
  })
);

// Logout endpoint - revoke refresh token
// NOTE: Với system mới, một user có thể có nhiều refresh tokens (multi-device)
// Hiện tại chỉ revoke token hiện tại. Để logout all devices, cần implement riêng.
userAuthRouter.post(
  "/logout",
  handleAsync(jwtAuth),
  handleAsync(requireAuth),
  handleAsync(async function (req: Request, res: Response) {
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
  })
);

// Google và Facebook login - có thể giữ lại hoặc implement với JWT sau
// userAuthRouter.get("/google-login", passportU.authenticate("google"));
// userAuthRouter.get(
//   "/google-login/callback",
//   passportU.authenticate("google"),
//   function (req: Request, res: Response) {
//     res.redirect(constEnv.clientOrigin!);
//   }
// );
// userAuthRouter.get("/facebook-login", passportU.authenticate("facebook"));
// userAuthRouter.get(
//   "/facebook-login/callback",
//   passportU.authenticate("facebook"),
//   function (req: Request, res: Response) {
//     res.redirect(constEnv.clientOrigin!);
//   }
// );
// Get user info - yêu cầu JWT authentication
userAuthRouter.get(
  "/getinfor",
  handleAsync(jwtAuth),
  handleAsync(requireAuth),
  handleAsync(async (req: Request, res: Response) => {
    const user = await userSrv.getById(req.user!.id);
    res.json(user);
  })
);

// Get current user - yêu cầu JWT authentication
userAuthRouter.get(
  "/current-user",
  handleAsync(jwtAuth),
  handleAsync(requireAuth),
  handleAsync(userCtrl.getCurrentUser)
);
userAuthRouter.post(
  "/otp/reset-password",
  [body("email").isEmail().withMessage("Email is not provided or valid!")],
  handleAsync(validate_request),
  handleAsync(async (req: Request, res: Response) => {
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
  })
);
userAuthRouter.post(
  "/request/reset-password",
  [
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("otp").trim().notEmpty().withMessage("OTP is required"),
  ],
  handleAsync(async (req: Request, res: Response) => {
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
  })
);

userAuthRouter.post(
  "/otp/verify-email",
  [
    body("key").notEmpty().withMessage("Key is required"),
    body("email").isEmail().withMessage("Email is required"),
  ],

  handleAsync(validate_request),
  handleAsync(async (req: Request, res: Response) => {
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
  })
);
userAuthRouter.post(
  "/request/verify-email",
  [
    body("otp").notEmpty().withMessage("OTP is required"),
    body("email").isEmail().withMessage("Email is required"),
  ],

  handleAsync(validate_request),
  handleAsync(async (req: Request, res: Response) => {
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
  })
);
export default userAuthRouter;
