"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_session_1 = __importDefault(require("cookie-session"));
const cors_1 = __importDefault(require("cors"));
const handle_error_1 = require("./middlewares/handle_error");
const passport_1 = require("./configs/passport");
const user_1 = __importDefault(require("./routes/user"));
const admin_1 = __importDefault(require("./routes/admin"));
const pub_1 = __importDefault(require("./routes/pub"));
const path_1 = __importDefault(require("path"));
const serve_index_1 = __importDefault(require("serve-index"));
const express = require("express");
const app = express();
// Lấy môi trường từ process.env.NODE_ENV
// Load file env tương ứng
app.set("trust proxy", true);
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
const env = process.env.APP_ENV;
const userCookieConfig = env === "prod" || env === "docker"
    ? { name: "user-session", sameSite: "none", httpOnly: true, signed: false }
    : {
        name: "user-session",
        sameSite: "lax",
        httpOnly: true,
        signed: false,
    };
const adminCookieConfig = env === "prod" || env === "docker"
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
app.use("/", (0, cookie_session_1.default)({
    name: "pub",
    signed: false,
    // secure: true, // must be connect in https connection
}));
app.use("/api/user", 
// @ts-ignore
(0, cookie_session_1.default)(userCookieConfig));
app.use("/api/admin", 
// @ts-ignore
(0, cookie_session_1.default)(adminCookieConfig));
app.use("/uploads", express.static(path_1.default.join(__dirname, "uploads")));
app.use("/uploads", (0, serve_index_1.default)(path_1.default.join(__dirname, "uploads"), {
    icons: true, // Hiển thị icon cho các file
    view: "details", // Hiển thị chi tiết (size, modified date, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport_1.passportA.initialize({ userProperty: "user" }));
app.use(passport_1.passportA.session());
app.use(passport_1.passportU.initialize({ userProperty: "user" }));
app.use(passport_1.passportU.session());
app.use("/api/user", user_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/pub", pub_1.default);
app.use("/test", (req, res) => {
    res.json("test");
});
app.use(handle_error_1.handleError);
exports.default = app;
