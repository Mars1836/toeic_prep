import { genAI } from "./instance";

export const chatModel = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });