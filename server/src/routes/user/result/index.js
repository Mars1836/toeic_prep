"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const result_1 = __importDefault(require("../../../controllers/result"));
const userResultRouter = express_1.default.Router();
userResultRouter.post("/items", (0, handle_async_1.handleAsync)(result_1.default.creataWithItems));
userResultRouter.post("/", (0, handle_async_1.handleAsync)(result_1.default.create));
userResultRouter.get("/test", (0, handle_async_1.handleAsync)(result_1.default.getByTest));
userResultRouter.get("/user", (0, handle_async_1.handleAsync)(result_1.default.getByUser));
userResultRouter.get("/id", (0, handle_async_1.handleAsync)(result_1.default.getById));
userResultRouter.delete("/id", (0, handle_async_1.handleAsync)(result_1.default.deleteById));
exports.default = userResultRouter;
