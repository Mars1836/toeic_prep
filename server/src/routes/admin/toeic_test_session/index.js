"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const toeic_test_session_1 = __importDefault(require("../../../controllers/toeic_test_session"));
const adminToeicTestSessionRouter = express_1.default.Router();
// Get all sessions with pagination
adminToeicTestSessionRouter.get("/", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getAll));
// Get session by ID
adminToeicTestSessionRouter.get("/:id", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getById));
// Create new session
adminToeicTestSessionRouter.post("/", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.create));
// Update session
adminToeicTestSessionRouter.put("/:id", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.update));
// Delete session
adminToeicTestSessionRouter.delete("/:id", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.deleteSession));
// Add participant to session
adminToeicTestSessionRouter.post("/:id/participants", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.addParticipant));
// Remove participant from session
adminToeicTestSessionRouter.delete("/:id/participants", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.removeParticipant));
// Get sessions by test ID
adminToeicTestSessionRouter.get("/test/:testId", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getSessionsByTestId));
// Get sessions by testing ID
adminToeicTestSessionRouter.get("/testing/:testingId", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getSessionsByTestingId));
// Get sessions by user ID
adminToeicTestSessionRouter.get("/user/:userId", (0, handle_async_1.handleAsync)(toeic_test_session_1.default.getSessionsByUserId));
exports.default = adminToeicTestSessionRouter;
