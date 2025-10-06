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
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const transcript_test_item_1 = require("../../../services/transcript_test_item");
const transcript_test_model_1 = require("../../../models/transcript_test.model");
const transcript_test_item_2 = __importDefault(require("../../../controllers/transcript_test_item"));
const utils_1 = require("../../../utils");
const uploadsDir = path_1.default.join(__dirname, "../../../uploads");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.transcriptTestId) {
            return cb(new Error("Transcript test ID is required"));
        }
        const transcript = yield transcript_test_model_1.transcriptTestModel.findById(req.body.transcriptTestId);
        if (!transcript) {
            return cb(new Error("Transcript test not found"));
        }
        let uploadPath;
        uploadPath = path_1.default.join(uploadsDir, transcript.url, transcript.code);
        req.preUrl = "/" + transcript.url + "/" + transcript.code;
        fs_1.default.mkdirSync(uploadPath, { recursive: true }); // Create directory structure
        cb(null, uploadPath);
    }),
    filename: (req, file, cb) => {
        const timeSecondRecommend = Date.now();
        const randomId = (0, utils_1.generateOTP)();
        cb(null, timeSecondRecommend + "_" + randomId + "_" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
const uploadFields = (0, multer_1.default)().fields([
    { name: "transcriptTestId", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
]);
const pubTranscriptTestItemRouter = express_1.default.Router();
pubTranscriptTestItemRouter.get("/", (0, handle_async_1.handleAsync)(transcript_test_item_2.default.getByQuery));
pubTranscriptTestItemRouter.post("/", upload.single("audio"), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        audioUrl: req.preUrl + "/" + req.file.filename,
        transcriptTestId: req.body.transcriptTestId,
        transcript: req.body.transcript,
    };
    const rs = yield (0, transcript_test_item_1.createTranscriptTestItem)(data);
    res.status(200).json(rs);
})));
pubTranscriptTestItemRouter.get("/transcript-test-id", (0, handle_async_1.handleAsync)(transcript_test_item_2.default.getByTranscriptTestId));
exports.default = pubTranscriptTestItemRouter;
