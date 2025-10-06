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
exports.demo = demo;
const instance_1 = require("./instance");
class SmartResponseSystem {
    constructor(apiKey) {
        this.genAI = instance_1.genAI;
        this.model = "gemini-1.5-flash";
        this.knowledgeBase = [];
    }
    // Thêm nội dung vào cơ sở tri thức
    addContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Tạo embedding cho nội dung
                const model = this.genAI.getGenerativeModel({
                    model: this.model,
                });
                const result = yield model.embedContent(content);
                this.knowledgeBase.push({
                    originalText: content,
                    embedding: result.embedding.values,
                });
            }
            catch (error) {
                console.error("Lỗi thêm nội dung:", error);
            }
        });
    }
    // Tính độ tương đồng giữa các vector
    cosineSimilarity(vector1, vector2) {
        const dotProduct = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0);
        const magnitude1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0));
        const magnitude2 = Math.sqrt(vector2.reduce((sum, a) => sum + a * a, 0));
        return dotProduct / (magnitude1 * magnitude2);
    }
    // Tìm các nội dung liên quan
    findRelevantContent(queryEmbedding, threshold = 0.7) {
        return this.knowledgeBase
            .map((item) => (Object.assign(Object.assign({}, item), { similarity: this.cosineSimilarity(queryEmbedding, item.embedding) })))
            .filter((item) => item.similarity > threshold)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3); // Lấy 3 kết quả liên quan nhất
    }
    // Xử lý và trả lời câu hỏi
    processQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Tạo embedding cho câu hỏi
                const model = this.genAI.getGenerativeModel({
                    model: this.model,
                });
                const queryEmbedding = yield model.embedContent(query);
                // Tìm nội dung liên quan
                const relevantContents = this.findRelevantContent(queryEmbedding.embedding.values);
                // Nếu không tìm thấy nội dung liên quan
                if (relevantContents.length === 0) {
                    return "Xin lỗi, tôi không tìm thấy thông tin phù hợp với câu hỏi của bạn.";
                }
                // Tổng hợp và trả lời
                const aiModel = this.genAI.getGenerativeModel({
                    model: this.model,
                });
                const contextText = relevantContents
                    .map((item) => item.originalText)
                    .join("\n\n");
                const aiResponse = yield aiModel.generateContent(`Sử dụng các thông tin sau đây để trả lời câu hỏi: 
        Câu hỏi: ${query}
        
        Thông tin liên quan:
        ${contextText}
        
        Hãy trả lời ngắn gọn, chính xác và thân thiện.`);
                return aiResponse.response.text();
            }
            catch (error) {
                console.error("Lỗi xử lý câu hỏi:", error);
                return "Đã có lỗi xảy ra. Xin vui lòng thử lại.";
            }
        });
    }
}
// Ví dụ sử dụng
function demo() {
    return __awaiter(this, void 0, void 0, function* () {
        const responseSystem = new SmartResponseSystem(process.env.GEMINI_API_KEY);
        // Thêm nội dung vào hệ thống
        yield responseSystem.addContent("Chúng tôi cung cấp dịch vụ sửa xe máy chuyên nghiệp");
        yield responseSystem.addContent("Bảng giá dịch vụ sửa chữa xe máy năm 2024 từ 100.000 đến 500.000 VND");
        // Thử nghiệm trả lời
        const response = yield responseSystem.processQuery("Các dịch vụ sửa xe của bạn như thế nào?");
        console.log(response);
    });
}
