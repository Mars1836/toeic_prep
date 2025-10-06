"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const test_1 = __importDefault(require("../../../controllers/test"));
const require_auth_1 = require("../../../middlewares/require_auth");
const testRouter = express_1.default.Router();
testRouter.post("/", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (0, handle_async_1.handleAsync)(test_1.default.create));
testRouter.get("/", (0, handle_async_1.handleAsync)(test_1.default.getByQuery));
exports.default = testRouter;
