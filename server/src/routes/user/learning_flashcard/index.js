"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const learning_flashcard_1 = __importDefault(require("../../../controllers/learning_flashcard"));
const learningFlashcardRouter = express_1.default.Router();
learningFlashcardRouter.get("/set", (0, handle_async_1.handleAsync)(learning_flashcard_1.default.getByLearningSet));
learningFlashcardRouter.post("/update-short-term-score", (0, handle_async_1.handleAsync)(learning_flashcard_1.default.updateShortTermScore));
learningFlashcardRouter.post("/update-session-score", (0, handle_async_1.handleAsync)(learning_flashcard_1.default.updateSessionScore));
exports.default = learningFlashcardRouter;
