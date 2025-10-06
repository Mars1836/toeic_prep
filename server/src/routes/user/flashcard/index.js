"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const flashcard_1 = __importDefault(require("../../../controllers/flashcard"));
const userFlashcardRouter = express_1.default.Router();
userFlashcardRouter.post("/", (0, handle_async_1.handleAsync)(flashcard_1.default.create));
userFlashcardRouter.post("/many", (0, handle_async_1.handleAsync)(flashcard_1.default.createMany));
userFlashcardRouter.delete("/", (0, handle_async_1.handleAsync)(flashcard_1.default.remove));
userFlashcardRouter.patch("/", (0, handle_async_1.handleAsync)(flashcard_1.default.update));
userFlashcardRouter.get("/set", (0, handle_async_1.handleAsync)(flashcard_1.default.getBySet));
// userFlashcardRouter.get("/user", handleAsync(FlashCardCtrl.getByUser));
// userFlashcardRouter.get("/publish", handleAsync(FlashCardCtrl.getPublish));
exports.default = userFlashcardRouter;
