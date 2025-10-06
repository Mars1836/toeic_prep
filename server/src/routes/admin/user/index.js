"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const user_1 = require("../../../controllers/user");
const adminUserRouter = express_1.default.Router();
adminUserRouter.get("/", (0, handle_async_1.handleAsync)(user_1.userCtrl.getAllUsers));
adminUserRouter.get("/upgrade", (0, handle_async_1.handleAsync)(user_1.userCtrl.getUpgradeUsers));
adminUserRouter.get("/analyst/new", (0, handle_async_1.handleAsync)(user_1.userCtrl.getNewUserAnalyst));
adminUserRouter.get("/analyst/upgrade", (0, handle_async_1.handleAsync)(user_1.userCtrl.getUpgradeUserAnalyst));
adminUserRouter.get("/analyst/progress", (0, handle_async_1.handleAsync)(user_1.userCtrl.getUserProgressAnalyst));
exports.default = adminUserRouter;
