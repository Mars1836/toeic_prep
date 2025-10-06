"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainAIModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
const instance_1 = require("./instance");
const schema = {
    description: "Tạo câu trả lời và giải thích cho câu hỏi trắc nghiệm bằng tiếng Việt",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        correctAnswer: { type: generative_ai_1.SchemaType.STRING, description: "Đáp án đúng" },
        options: {
            type: generative_ai_1.SchemaType.ARRAY,
            description: "Các đáp án",
            items: {
                type: generative_ai_1.SchemaType.OBJECT,
                properties: {
                    label: {
                        type: generative_ai_1.SchemaType.STRING,
                        description: "Nhãn đáp án (A, B, C, D)",
                    },
                    text: { type: generative_ai_1.SchemaType.STRING, description: "Nội dung đáp án" },
                },
                required: ["label", "text"],
            },
        },
        explanation: {
            type: generative_ai_1.SchemaType.OBJECT,
            description: "Giải thích chi tiết",
            properties: {
                correctReason: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "Lý do đáp án đúng là chính xác",
                },
                incorrectReasons: {
                    type: generative_ai_1.SchemaType.OBJECT,
                    properties: {
                        A: { type: generative_ai_1.SchemaType.STRING, description: "Lý do đáp án A sai" },
                        B: { type: generative_ai_1.SchemaType.STRING, description: "Lý do đáp án B sai" },
                        C: { type: generative_ai_1.SchemaType.STRING, description: "Lý do đáp án C sai" },
                        D: { type: generative_ai_1.SchemaType.STRING, description: "Lý do đáp án D sai" },
                    },
                    required: ["A", "B", "C", "D"],
                },
            },
            required: ["correctReason", "incorrectReasons"],
        },
    },
    required: ["correctAnswer", "options", "explanation"],
};
exports.explainAIModel = instance_1.genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
    },
});
