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

app.set("trust proxy", true);


// CORS Configuration

//  Cho phép tất cả origins 
/*
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
*/

// OPTION 3: Multiple origins (array)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://vercel.codelife138.io.vn'
  ],
  credentials: true
}));

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

app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NoSQL Injection Protection
app.use(
  preventNoSqlInjection({
    mode: 'block',
    logAttempts: true,
  })
);

// XSS Protection - Sanitize Input
app.use(
  sanitizeInput({
    whitelist: [],
    logSanitized: process.env.APP_ENV === 'dev',
  })
);

// CSRF Protection - Double Submit Cookie
// app.use(
//   csrfProtection({
//     whitelist: [
//       '/api/user/auth/login',
//       '/api/user/auth/register',
//       '/api/user/auth/logout',
//       '/api/user/auth/refresh',
//       '/api/user/auth/google',
//       '/api/user/auth/facebook',
//       '/api/admin/auth/login',
//       '/api/admin/auth/logout',
//       '/api/admin/auth/refresh',
//       '/api/pub',
//       '/api/pub/csrf-token',
//     ],
//     cookieName: 'XSRF-TOKEN',
//     headerName: 'x-csrf-token',
//   })
// );

// Static File Serving - Uploads

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

// Routes

app.use("/api/user", routerU);
app.use("/api/admin", routerA);
app.use("/api/pub", routerP);
app.use("/test", (req: Request, res: Response) => {
  res.json("test");
});

app.use(handleError);

export default app;
