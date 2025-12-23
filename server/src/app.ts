import { Response } from "express";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";

import cors from "cors";
import { handleError } from "./middlewares/handle_error";
import { staticFileAuth } from "./middlewares/static_file_auth";
import { handleAsync } from "./middlewares/handle_async";
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
