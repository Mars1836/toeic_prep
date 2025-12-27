import { Response, Request, NextFunction } from "express";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import cors from "cors";
import { handleError } from "./middlewares/handle_error";
import { requireAuth } from "./middlewares/require_auth";
import { handleAsync } from "./middlewares/handle_async";
import { sanitizeInput } from "./middlewares/sanitize.middleware";
import { preventNoSqlInjection } from "./middlewares/prevent_nosql_injection.middleware";
import routerU from "./routes/user";
import routerA from "./routes/admin";
import routerP from "./routes/pub";
import path from "path";
import { csrfProtection } from "./middlewares/csrf.middleware";
const express = require("express");
const app = express();
// Lấy môi trường từ process.env.NODE_ENV

// Load file env tương ứng

app.set("trust proxy", true);


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

// Public session (for legacy support)
app.use(
  "/",
  cookieSession({
    name: "pub",
    signed: false,
    // secure: true, // must be connect in https connection
  })
);

// ============================================
// NOTE: Admin và User đã chuyển sang JWT
// Không cần cookie session nữa, chỉ cần cookieParser
// JWT tokens được lưu trong cookies: access_token, refresh_token
// ============================================

// IMPORTANT: Parse cookies BEFORE static file auth
app.use(cookieParser()); // Parse cookies từ request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NOSQL INJECTION PROTECTION

app.use(
  preventNoSqlInjection({
    mode: 'block', // Chặn hoàn toàn injection attempts
    logAttempts: true, // Log tất cả attempts để monitor
  })
);

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
// CSRF PROTECTION - DOUBLE SUBMIT COOKIE
// ============================================
app.use(
  csrfProtection({
    whitelist: [
      // Authentication endpoints - không cần CSRF token
      '/api/user/auth/login',
      '/api/user/auth/register',
      '/api/user/auth/logout',
      '/api/user/auth/refresh',
      '/api/user/auth/google',
      '/api/user/auth/facebook',
      '/api/admin/auth/login',
      '/api/admin/auth/logout',
      '/api/admin/auth/refresh',
      
      // Public endpoints
      '/api/pub', // Tất cả public routes
      
      // CSRF token endpoint
      '/api/pub/csrf-token',
    ],
    cookieName: 'XSRF-TOKEN',
    headerName: 'x-csrf-token',
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
   handleAsync(requireAuth),
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

// ============================================
// ROUTES
// ============================================

app.use("/api/user", routerU);
app.use("/api/admin", routerA);
app.use("/api/pub", routerP);
app.use("/test", (req: Request, res: Response) => {
  res.json("test");
});

app.use(handleError);

export default app;
