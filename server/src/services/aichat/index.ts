import { recommendPrompt } from "./../../configs/aichat/recommend";
import { readScore } from "./../../const/toeic";
import { explainAIModel } from "../../configs/aichat/explainQues";
import { modelAI } from "../../configs/aichat/fillField";
import { modelAIQuizz } from "../../configs/aichat/renderQuizz";
import { BadRequestError } from "../../errors/bad_request_error";
import { FlashcardAttr } from "../../models/flashcard.model";
import ProfileService from "../profile";
import { modelAIRecommend } from "../../configs/aichat/recommend";
import { userModel, UserTargetScore } from "../../models/user.model";
import { recommendModel } from "../../models/recommend";
import { createRecommend } from "../recommend";
import axios from "axios";
import { genAI } from "../../configs/aichat/instance";
import { aiChatSessionModel } from "../../models/ai_chat_session.model";
import { aiChatMessageModel } from "../../models/ai_chat_message.model";
import { chatModel } from "../../configs/aichat/chat_model";
function promptText(word: string) {
  return `Provide structured details for the word "${word}" following the specified schema.`;
}
namespace AiChatSrv {

  export async function getListSessions({userId}: {userId: string}) {
    const sessions = await aiChatSessionModel.find({userId}).lean();
    return sessions;
  }


  export async function startSession({
    userId,
    title,
  }: {
    userId: string;
    title?: string;
  }) {
    const session = await aiChatSessionModel.create({
      userId,
      title,
    });
    return session.toJSON();
  }

  export async function getHistory({
    userId,
    sessionId,
    limit,
  }: {
    userId: string;
    sessionId: string;
    limit?: number;
  }) {
    const session = await aiChatSessionModel.findById(sessionId);
    if (!session || String(session.userId) !== String(userId)) {
      throw new BadRequestError("Invalid session");
    }
    const take = Math.min(Math.max(limit || 50, 1), 200);
    const items = await aiChatMessageModel
      .find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(take);
    return items.map((m) => m.toJSON());
  }

  export async function deleteHistory({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) {
    const session = await aiChatSessionModel.findById(sessionId);
    if (!session || String(session.userId) !== String(userId)) {
      throw new BadRequestError("Invalid session");
    }
    await aiChatMessageModel.deleteMany({ sessionId });
    await aiChatSessionModel.deleteOne({ _id: sessionId });
    return { ok: true };
  }


  export async function sendMessage({
    userId,
    sessionId,
    content,
    socketId,
  }: {
    userId: string;
    sessionId?: string;
    content: string;
    socketId?: string;
  }) {
    if (!content?.trim()) throw new BadRequestError("content is required");
  
    let session;
    let actualSessionId = sessionId;
  
    // 🔄 Tự động tạo session nếu chưa có
    if (!sessionId) {
      const derivedTitle = content
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 60);
      session = await aiChatSessionModel.create({
        userId,
        title: derivedTitle,
      });
      actualSessionId = session.id;
      console.log("Tạo session");
      
      // 📡 Gửi sessionId ngay lập tức qua Socket.IO nếu có
      if (socketId && (global as any).io) {
        console.log("Gửi sessionId ngay lập tức qua Socket.IO nếu có");
        (global as any).io.to(socketId).emit("session_created", {
          sessionId: actualSessionId,
          isNewSession: true,
        });
      }
    } else {
      // ✅ Kiểm tra session có tồn tại và thuộc về user không
      session = await aiChatSessionModel.findById(sessionId);
      if (!session || String(session.userId) !== String(userId)) {
        throw new BadRequestError("Invalid session");
      }
    }
  
    // ⚡️ Lấy lịch sử tin nhắn
    const historyDocs = await aiChatMessageModel
      .find({ sessionId: actualSessionId })
      .sort({ createdAt: 1 })
      .limit(30);
  
    // ✅ Lưu tin nhắn người dùng
    await aiChatMessageModel.create({
      sessionId: actualSessionId,
      role: "user",
      content,
    });
  
    // ⚙️ Khởi tạo chat với lịch sử gần nhất
    const chat = chatModel.startChat({
      history: historyDocs.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });
  
    // ⚡️ Gửi và stream phản hồi
    const result = await chat.sendMessageStream(content);
    let reply = "";
  
    // 📡 Bắt đầu streaming nếu có socketId
    if (socketId && (global as any).io) {
      (global as any).io.to(socketId).emit("stream_start", {    
        sessionId: actualSessionId,
        messageId: null, // Sẽ được set sau khi lưu
      });
    }
  
    for await (const chunk of result.stream) {
      const part = chunk.text();
      console.log(part)
      reply += part;
  
      // 📡 Gửi từng chunk qua Socket.IO
      if (socketId && (global as any).io) {
        (global as any).io.to(socketId).emit("chat_stream", {
          sessionId: actualSessionId,
          chunk: part,
          isComplete: false,
        });
      }
    }
  
    // 💾 Lưu tin nhắn model
    const modelMsg = await aiChatMessageModel.create({
      sessionId: actualSessionId,
      role: "model",
      content: reply,
    });
  
    // 🔄 Cập nhật thời gian tin nhắn cuối
    session.lastMessageAt = new Date();
    await session.save();
  
    // 📡 Gửi thông báo hoàn thành streaming
    if (socketId && (global as any).io) {
      (global as any).io.to(socketId).emit("stream_complete", {
        sessionId: actualSessionId,
        messageId: modelMsg.id,
        fullReply: reply,
      });
    }
  
    return {
      reply,
      messageId: modelMsg.id,
      sessionId: actualSessionId,
      isNewSession: !sessionId, // Thông báo cho client biết đây là session mới
    };
  }

  export async function getFlashcardInfor(prompt: string) {
    if (!prompt) {
      throw new BadRequestError("prompt is required");
    }
    const promptHandled = promptText(prompt);
    const result = await modelAI.generateContent(promptHandled);
    return result.response.text();
  }
  export async function getQuizz(flashcards: FlashcardAttr[]) {
    const prompt = `Generate quiz questions based on this input: ${JSON.stringify(
      flashcards
    )}`;
    const result = await modelAIQuizz.generateContent(prompt);
    return result.response.text();
  }
  export async function explainQuestion(question: any) {
    const prompt = `Tạo lời giải bằng tiếng Việt cho các câu hỏi có dữ liệu là đoạn văn bản. Trong lời giải, nếu câu trả lời có thể được trích từ đoạn văn, hãy chỉ rõ câu nào thể hiện đáp án đúng và đoạn văn đó nằm ở vị trí thứ mấy (nếu văn bản có nhiều đoạn).   : ${JSON.stringify(
      question
    )}`;

    const image = question.image;

    if (Array.isArray(image) && image.length > 0) {
      const imageList = await Promise.all(
        image.map(async (item: string) => {
          const { data } = await axios.get(item, { responseType: "arraybuffer" });
          return {
            inlineData: {
              data: Buffer.from(data).toString("base64"),
              mimeType: "image/jpg",
            },
          };
        })
      );
      
      const result = await explainAIModel.generateContent([prompt, ...imageList]);
      return result.response.text();

    } else {
      const result = await explainAIModel.generateContent(prompt);
      return result.response.text();
    }
  }

  // export async function explainQuestion(question: any) {
  //   const prompt = `Tạo lời giải bằng tiếng Việt cho các câu hỏi có dữ liệu là đoạn văn bản. Trong lời giải, nếu câu trả lời có thể được trích từ đoạn văn, hãy chỉ rõ câu nào thể hiện đáp án đúng và đoạn văn đó nằm ở vị trí thứ mấy (nếu văn bản có nhiều đoạn): ${JSON.stringify(
  //     question
  //   )}`;
  
  //   const result = await explainAIModel.generateContent(prompt);
  //   return result.response.text();
  // }

  
  export async function suggestForStudy({ userId }: { userId: string }) {
    const analyst = await ProfileService.getAnalyst(userId);
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const targetScore = user.targetScore;
    const prompt = await recommendPrompt(analyst, targetScore!);
    const text = await modelAIRecommend.generateContent(prompt);
    const rs = text.response.text();
    const recommend = await createRecommend({
      userId,
      targetScore: targetScore as UserTargetScore,
      content: rs,
    });
    return rs;
  }
  export async function explainQuestionJson(question: Object) {
    const text = await explainQuestion(question);
    return JSON.parse(text);
  }
  export async function getQuizzJson(flashcards: FlashcardAttr[]) {
    const text = await getQuizz(flashcards);
    return JSON.parse(text);
  }
  export async function getFlashcardInforJson(prompt: string) {
    const text = await getFlashcardInfor(prompt);
    return JSON.parse(text);
  }
  export async function getSuggestForStudyJson(userId: string) {
    const text = await suggestForStudy({ userId });
    return JSON.parse(text);
  }
}

export default AiChatSrv;
