"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const instance_1 = require("./instance");
exports.chatModel = instance_1.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
