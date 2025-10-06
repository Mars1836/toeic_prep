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
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const multer_1 = __importDefault(require("multer"));
const speechclient_1 = require("../../../configs/speechclient");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const providerRouter = express_1.default.Router();
providerRouter.post("/speech-to-text", upload.single("audio"), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }
    if (req.file.mimetype !== "audio/webm") {
        return res
            .status(400)
            .send("Invalid file format. Only WAV is supported.");
    }
    const audioBytes = req.file.buffer.toString("base64");
    const audio = { content: audioBytes };
    const config = {
        encoding: "WEBM_OPUS", // Định dạng WebM Opus
        sampleRateHertz: 48000, // WebM thường sử dụng sample rate 48kHz
        languageCode: "en-US", // Ngôn ngữ sử dụng
    };
    const request = {
        audio: audio,
        config: config,
    };
    try {
        // Gọi API Google Cloud Speech-to-Text
        const [response] = yield speechclient_1.client.recognize(request);
        const transcript = response.results
            .map((result) => result.alternatives[0].transcript)
            .join("\n");
        console.log(transcript);
        res.json({ transcript });
    }
    catch (error) {
        console.error("Error:", error);
        res
            .status(500)
            .send("An error occurred while processing the speech-to-text request");
    }
})));
exports.default = providerRouter;
