import { genAI } from "./instance";

export const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });