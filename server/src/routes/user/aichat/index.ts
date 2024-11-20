import express, { Request, Response } from "express";

import { handleAsync } from "../../../middlewares/handle_async";
import AiChatSrv from "../../../services/aichat";
import AiChatCtrl from "../../../controllers/aichat";

const aiChatRouter = express.Router();
aiChatRouter.post("/get-fc-infor", handleAsync(AiChatCtrl.getFlashcardInfor));
aiChatRouter.post("/get-quizz", handleAsync(AiChatCtrl.getQuizz));

export default aiChatRouter;
