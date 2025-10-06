"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = require("../../../configs/passport");
const handle_async_1 = require("../../../middlewares/handle_async");
const bad_request_error_1 = require("../../../errors/bad_request_error");
const require_auth_1 = require("../../../middlewares/require_auth");
const admin_1 = require("../../../controllers/admin");
const adminAuthRouter = express_1.default.Router();
adminAuthRouter.get("/login", (req, res) => {
    res.json("Test success");
});
adminAuthRouter.post("/login", passport_1.passportA.authenticate("local", {
    failureRedirect: "/api/admin/login/failed",
}), function (req, res) {
    res.json(req.user);
});
adminAuthRouter.get("/login/failed", (0, handle_async_1.handleAsync)(function (req, res) {
    throw new bad_request_error_1.BadRequestError("Username or password is wrong");
}));
adminAuthRouter.get("/getinfor", function (req, res) {
    res.json(req.user);
});
adminAuthRouter.post("/signup", (0, handle_async_1.handleAsync)(admin_1.AdminCtrl.localRegister));
adminAuthRouter.get("/current-user", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (0, handle_async_1.handleAsync)(admin_1.AdminCtrl.getCurrentUser));
adminAuthRouter.post("/logout", (0, handle_async_1.handleAsync)(admin_1.AdminCtrl.logout));
exports.default = adminAuthRouter;
