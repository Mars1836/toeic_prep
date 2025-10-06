"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const result_item_1 = __importDefault(require("../../../controllers/result_item"));
const userResultItemRouter = express_1.default.Router();
userResultItemRouter.get("/part", (0, handle_async_1.handleAsync)(result_item_1.default.getByPart));
userResultItemRouter.get("/user", (0, handle_async_1.handleAsync)(result_item_1.default.getByUser));
userResultItemRouter.get("/result", (0, handle_async_1.handleAsync)(result_item_1.default.getByResult));
exports.default = userResultItemRouter;
