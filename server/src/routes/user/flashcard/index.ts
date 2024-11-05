import express, { Request, Response } from "express";
import { body } from "express-validator";
import SetFlashcardSrv from "../../../services/set_flashcard";
import { handleAsync } from "../../../middlewares/handle_async";
import { validate_request } from "../../../middlewares/validate_request";
import FlashCardSrv from "../../../services/flashcard";
import FlashCardCtrl from "../../../controllers/flashcard";
const userFlashcardRouter = express.Router();
userFlashcardRouter.post("/", handleAsync(FlashCardCtrl.create));
userFlashcardRouter.delete("/", handleAsync(FlashCardCtrl.remove));
userFlashcardRouter.patch("/", handleAsync(FlashCardCtrl.update));

export default userFlashcardRouter;
