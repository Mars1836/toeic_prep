"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const result_1 = __importDefault(require("../../../controllers/result"));
const adminResultRouter = express_1.default.Router();
adminResultRouter.get("/analyst/new", (0, handle_async_1.handleAsync)(result_1.default.getNewResultAnalyst));
adminResultRouter.get("/analyst/progress", (0, handle_async_1.handleAsync)(result_1.default.getUserProgressAnalyst));
exports.default = adminResultRouter;
