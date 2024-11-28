import { passportA } from "./../../configs/passport";
import { Request, Response } from "express";
import { FlashcardAttr, FlashcardModel } from "../../models/flashcard.model";
import FlashCardSrv from "../../services/flashcard";
import AiChatSrv from "../../services/aichat";

namespace AiChatCtrl {
  export async function getFlashcardInfor(req: Request, res: Response) {
    const { prompt } = req.body;
    const rs = await AiChatSrv.getFlashcardInfor(prompt);
    res.status(200).json(rs);
  }
  export async function getQuizz(req: Request, res: Response) {
    const { prompt } = req.body;
    const rs = await AiChatSrv.getQuizz(prompt);
    res.status(200).json(rs);
  }
  export async function explainQuestion(req: Request, res: Response) {
    const { prompt } = req.body;
    const rs = await AiChatSrv.explainQuestion(prompt);
    res.status(200).json(rs);
  }
}
export default AiChatCtrl;
