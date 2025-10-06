"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = require("../instance");
class SmartChatbot {
    constructor(embedding) {
        this.genAI = instance_1.genAI;
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.embedding = embedding;
    }
    // Tạo prompt thông minh
    generateResponse(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Tìm các tài liệu liên quan
                const relevantDocuments = this.embedding.searchRelevant(query);
                // Xây dựng context
                const contextPrompt = relevantDocuments
                    .map((doc) => `Nguồn [${doc.url}]: ${doc.content}`)
                    .join("\n\n");
                // Prompt hoàn chỉnh
                const fullPrompt = `
                Bối cảnh: ${contextPrompt}

                Câu hỏi: ${query}

                Yêu cầu:
                - Trả lời dựa trên bối cảnh cung cấp
                - Nếu không có thông tin liên quan, trả lời bằng kiến thức chung
                - Giải thích nguồn thông tin nếu có thể
            `;
                // Gọi API Gemini
                const result = yield this.model.generateContent(fullPrompt);
                return result.response.text();
            }
            catch (error) {
                console.error("Lỗi tạo phản hồi:", error);
                return "Xin lỗi, tôi không thể trả lời câu hỏi này.";
            }
        });
    }
    // Log và theo dõi cuộc trò chuyện
    logConversation(query, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversationLog = {
                timestamp: new Date().toISOString(),
                query,
                response,
            };
            // Có thể mở rộng để lưu vào database
            console.log(JSON.stringify(conversationLog, null, 2));
        });
    }
}
exports.default = SmartChatbot;
