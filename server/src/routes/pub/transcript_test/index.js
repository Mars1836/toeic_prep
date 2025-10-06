"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const transcript_test_1 = __importDefault(require("../../../controllers/transcript_test"));
const pubTranscriptTestRouter = express_1.default.Router();
pubTranscriptTestRouter.get("/", (0, handle_async_1.handleAsync)(transcript_test_1.default.getByQuery));
pubTranscriptTestRouter.post("/", (0, handle_async_1.handleAsync)(transcript_test_1.default.create));
exports.default = pubTranscriptTestRouter;
