"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const require_auth_1 = require("../../../middlewares/require_auth");
const toeic_test_session_1 = __importDefault(require("../../../controllers/toeic_test_session"));
const userToeicTestSessionRouter = express_1.default.Router();
// Get user's own sessions
userToeicTestSessionRouter.get("/my-sessions", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getMySessions));
userToeicTestSessionRouter.get("/exam", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getExamByToken));
userToeicTestSessionRouter.get("/my-sessions/:id", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getSessionByUserIdAndId));
exports.default = userToeicTestSessionRouter;
