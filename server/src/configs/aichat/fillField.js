"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelAI = void 0;
const generative_ai_1 = require("@google/generative-ai");
const instance_1 = require("./instance");
const schema = {
    description: "Word details in a structured format",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        definition: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Definition of the word",
            nullable: false,
        },
        example1: {
            type: generative_ai_1.SchemaType.STRING,
            description: "An example sentence for using the word",
            nullable: false,
        },
        example2: {
            type: generative_ai_1.SchemaType.STRING,
            description: "An example sentence for using the word",
            nullable: false,
        },
        note: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Additional notes about the word usage",
            nullable: false,
        },
        partOfSpeech: {
            type: generative_ai_1.SchemaType.ARRAY,
            description: "The parts of speech the word can function as",
            items: {
                type: generative_ai_1.SchemaType.STRING,
            },
            nullable: false,
        },
        pronunciation: {
            type: generative_ai_1.SchemaType.STRING,
            description: "The pronunciation of the word",
            nullable: false,
        },
        translation: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Translation of the word in vietnamese",
            nullable: false,
        },
        word: {
            type: generative_ai_1.SchemaType.STRING,
            description: "The word itself",
            nullable: false,
        },
    },
    required: [
        "definition",
        "example1",
        "example2",
        "note",
        "partOfSpeech",
        "pronunciation",
        "translation",
        "word",
    ],
};
exports.modelAI = instance_1.genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
    },
});
