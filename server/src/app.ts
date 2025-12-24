import { Response } from "express";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import cors from "cors";
import { handleError } from "./middlewares/handle_error";
import { staticFileAuth } from "./middlewares/static_file_auth";
import { handleAsync } from "./middlewares/handle_async";
import { sanitizeInput } from "./middlewares/sanitize.middleware";
import { passportA } from "./configs/passport"; // Chỉ giữ passportA cho admin
import routerU from "./routes/user";
import routerA from "./routes/admin";
import routerP from "./routes/pub";
import path from "path";
const express = require("express");
const app = express();
// Lấy môi trường từ process.env.NODE_ENV

// Load file env tương ứng

app.set("trust proxy", true);

// ============================================
// SECURITY HEADERS - HELMET
// ============================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Cho phép inline scripts (cần thiết cho một số frameworks)
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'"],
        mediaSrc: ["'self'", "blob:"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Tắt để tránh conflict với CORS
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Cho phép cross-origin requests
  })
);

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));

const env = process.env.APP_ENV;
console.log(env);
const userCookieConfig =
  env === "prod" || env === "docker" 
    ? { name: "user-session", sameSite: "none", httpOnly: true, signed: false }
    : {
        name: "user-session",
        sameSite: "lax",
        httpOnly: true,
        signed: false,
      };
const adminCookieConfig =
  env === "prod" || env === "docker"
    ? {
        name: "admin-session",
        sameSite: "none",
        httpOnly: true,
        signed: false,
      }
    : {
        name: "admin-session",
        sameSite: "lax",
        httpOnly: true,
        signed: false,
      };
app.use(
  "/",
  cookieSession({
    name: "pub",
    signed: false,
    // secure: true, // must be connect in https connection
  })
);
app.use(
  "/api/user",
  // @ts-ignore
  cookieSession(userCookieConfig)
);
app.use(
  "/api/admin",
  // @ts-ignore
  cookieSession(adminCookieConfig)
);

// IMPORTANT: Parse cookies BEFORE static file auth
app.use(cookieParser()); // Parse cookies từ request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// XSS PROTECTION - SANITIZE INPUT
// ============================================
// Tự động sanitize tất cả input từ req.body, req.query, req.params
// Whitelist: các trường không cần sanitize (giữ nguyên HTML)
app.use(
  sanitizeInput({
    whitelist: [
      // Thêm các trường cần giữ nguyên HTML vào đây
      // Ví dụ: 'blogContent', 'htmlDescription'
    ],
    logSanitized: process.env.APP_ENV === 'dev', // Chỉ log trong môi trường dev
  })
);

// ============================================
// STATIC FILE SERVING - UPLOADS
// ============================================

// Protected uploads (require authentication)
const protectedUploads = [
  "excels",
  "audios",
  "transcript-test",
  "profile"
];

protectedUploads.forEach(dir => {
  app.use(
    `/uploads/${dir}`,
    staticFileAuth,
    express.static(path.join(__dirname, "uploads", dir))
  );
});

// Public uploads (no authentication required)
const publicUploads = [
  "images",
  "blog"
];

publicUploads.forEach(dir => {
  app.use(
    `/uploads/${dir}`,
    express.static(path.join(__dirname, "uploads", dir))
  );
});


// Passport chỉ dùng cho admin, không dùng cho user nữa
app.use(passportA.initialize({ userProperty: "user" }));
app.use(passportA.session());

app.use("/api/user", routerU);
app.use("/api/admin", routerA);
app.use("/api/pub", routerP);
app.use("/test", (req: Request, res: Response) => {
  res.json("test");
});

app.use(handleError);

export default app;
