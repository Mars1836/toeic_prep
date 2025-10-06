"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const set_flashcard_1 = __importDefault(require("../../../controllers/set_flashcard"));
const handle_async_1 = require("../../../middlewares/handle_async");
const userSetFlashcardRouter = express_1.default.Router();
userSetFlashcardRouter.post("/", (0, handle_async_1.handleAsync)(set_flashcard_1.default.create));
userSetFlashcardRouter.get("/id", (0, handle_async_1.handleAsync)(set_flashcard_1.default.getById));
userSetFlashcardRouter.get("/user", (0, handle_async_1.handleAsync)(set_flashcard_1.default.getByUser));
userSetFlashcardRouter.get("/public", (0, handle_async_1.handleAsync)(set_flashcard_1.default.getPublic));
userSetFlashcardRouter.delete("/", (0, handle_async_1.handleAsync)(set_flashcard_1.default.remove));
userSetFlashcardRouter.patch("/", (0, handle_async_1.handleAsync)(set_flashcard_1.default.update));
exports.default = userSetFlashcardRouter;
