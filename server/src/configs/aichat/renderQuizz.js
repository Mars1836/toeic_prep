"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelAIQuizz = void 0;
const generative_ai_1 = require("@google/generative-ai");
const instance_1 = require("./instance");
const schema = {
    description: "Generate quiz questions for flashcards with their IDs",
    type: generative_ai_1.SchemaType.ARRAY,
    items: {
        type: generative_ai_1.SchemaType.OBJECT,
        properties: {
            flashcardId: { type: generative_ai_1.SchemaType.STRING, description: "Flashcard ID" },
            word: { type: generative_ai_1.SchemaType.STRING, description: "The word" },
            quiz: {
                type: generative_ai_1.SchemaType.OBJECT,
                properties: {
                    question: { type: generative_ai_1.SchemaType.STRING, description: "Quiz question" },
                    options: {
                        type: generative_ai_1.SchemaType.ARRAY,
                        items: { type: generative_ai_1.SchemaType.STRING },
                        description: "Four answer options",
                    },
                    correctAnswer: {
                        type: generative_ai_1.SchemaType.STRING,
                        description: "The correct answer",
                    },
                },
                required: ["question", "options", "correctAnswer"],
            },
        },
        required: ["flashcardId", "word", "quiz"],
    },
};
exports.modelAIQuizz = instance_1.genAI.getGenerativeModel({
    model: "gemini-flash-lite-latest",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
    },
});
