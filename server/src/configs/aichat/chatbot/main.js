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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const path_1 = __importDefault(require("path"));
const TFIDFEmbedding_1 = __importDefault(require("./TFIDFEmbedding"));
const SmartChatbot_1 = __importDefault(require("./SmartChatbot"));
const WebCrawler_1 = __importDefault(require("./WebCrawler"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Khởi tạo crawler
        const crawler = new WebCrawler_1.default();
        yield crawler.crawl("http://localhost:3000");
        // Khởi tạo embedding
        const embedding = new TFIDFEmbedding_1.default();
        embedding.loadDocuments(path_1.default.join(__dirname, "crawled_data.json"));
        // Khởi tạo chatbot
        const chatbot = new SmartChatbot_1.default(embedding);
        // Ví dụ sử dụng
        const query = "Bạn có thể cho tôi biết thêm thông tin về chủ đề tương lai máy tính?";
        const response = yield chatbot.generateResponse(query);
        console.log("Truy vấn:", query);
        console.log("Phản hồi:", response);
        yield chatbot.logConversation(query, response);
    });
}
main().catch(console.error);
