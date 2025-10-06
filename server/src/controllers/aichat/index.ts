import { Request, Response } from "express";
import AiChatSrv from "../../services/aichat";

namespace AiChatCtrl {
  export async function startSession(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const { title } = req.body;
    const rs = await AiChatSrv.startSession({ userId, title });
    res.status(201).json(rs);
  }

  export async function getListSessions(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const rs = await AiChatSrv.getListSessions({ userId });
    res.status(200).json(rs);
  }

  export async function sendMessage(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const { sessionId, content, socketId } = req.body;
    const rs = await AiChatSrv.sendMessage({ userId, sessionId, content, socketId });
    res.status(200).json(rs);
  }
  export async function getHistory(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { limit } = req.query as { limit?: string };
    const rs = await AiChatSrv.getHistory({
      userId,
      sessionId,
      limit: limit ? parseInt(limit) : undefined,
    });
    res.status(200).json(rs);
  }
  export async function deleteHistory(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const { sessionId } = req.params as any;
    await AiChatSrv.deleteHistory({ userId, sessionId });
    res.status(204).send();
  }
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
  export async function explainQuestionJson(req: Request, res: Response) {
    const { prompt } = req.body;
    const rs = await AiChatSrv.explainQuestionJson(prompt);
    res.status(200).json(rs);
  }
  export async function getQuizzJson(req: Request, res: Response) {
    const { prompt } = req.body;
    const rs = await AiChatSrv.getQuizzJson(prompt);
    res.status(200).json(rs);
  }
  export async function getFlashcardInforJson(req: Request, res: Response) {
    const { prompt } = req.body;
    const rs = await AiChatSrv.getFlashcardInforJson(prompt);
    res.status(200).json(rs);
  }
  export async function suggestForStudy(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;
    const rs = await AiChatSrv.suggestForStudy({ userId });
    res.status(200).json(rs);
  }
}
export default AiChatCtrl;
