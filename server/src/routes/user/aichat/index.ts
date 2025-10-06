import express, { Request, Response } from "express";

import { handleAsync } from "../../../middlewares/handle_async";
import { requireAuth } from "../../../middlewares/require_auth";
import AiChatSrv from "../../../services/aichat";
import AiChatCtrl from "../../../controllers/aichat";

const aiChatRouter = express.Router();
aiChatRouter.post(
  "/session",
  requireAuth,
  handleAsync(AiChatCtrl.startSession)
);
aiChatRouter.get(
  "/list-sessions", 
  requireAuth, 
  handleAsync(AiChatCtrl.getListSessions)
);
aiChatRouter.post(
  "/send",
  requireAuth,
  handleAsync(AiChatCtrl.sendMessage)
);
aiChatRouter.get(
  "/history/:sessionId",
  requireAuth,
  handleAsync(AiChatCtrl.getHistory)
);
aiChatRouter.post(
  "/get-explanation/json",
  handleAsync(AiChatCtrl.explainQuestionJson)
);
aiChatRouter.post("/get-quizz/json", handleAsync(AiChatCtrl.getQuizzJson));
aiChatRouter.post(
  "/get-fc-infor/json",
  handleAsync(AiChatCtrl.getFlashcardInforJson)
);
aiChatRouter.post("/get-fc-infor", handleAsync(AiChatCtrl.getFlashcardInfor));
aiChatRouter.post("/get-quizz", handleAsync(AiChatCtrl.getQuizz));
aiChatRouter.post("/get-explanation", handleAsync(AiChatCtrl.explainQuestion));
aiChatRouter.post(
  "/suggest-for-study",
  handleAsync(AiChatCtrl.suggestForStudy)
);
export default aiChatRouter;
