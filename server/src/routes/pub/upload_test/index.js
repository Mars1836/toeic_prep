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
const utils_1 = require("../../../utils");
const test_1 = __importDefault(require("../../../services/test"));
const uploadsDir = path_1.default.join(__dirname, "../../../uploads");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const randomId = req.randomId;
        let uploadPath;
        if (file.fieldname === "images") {
            uploadPath = path_1.default.join(uploadsDir, "images", randomId); // Thư mục cho audio
        }
        else if (file.fieldname === "audioFiles") {
            uploadPath = path_1.default.join(uploadsDir, "audios", randomId); // Thư mục cho documents
        }
        else if (file.fieldname === "excelFile") {
            uploadPath = path_1.default.join(uploadsDir, "excels", randomId); // Thư mục cho documents
        }
        fs_1.default.mkdirSync(uploadPath, { recursive: true }); // Create directory structure
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, path_1.default.basename(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const uploadRouter = express_1.default.Router();
uploadRouter.post("/", (req, res, next) => {
    req.randomId = (0, utils_1.generateOTP)().toString(); // Tạo randomId mới
    next();
}, upload.fields([
    { name: "images" },
    { name: "audioFiles" },
    { name: "excelFile" },
]), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {
        title: req.body.title,
        type: req.body.type,
        path: req.files.excelFile[0].filename,
        code: req.randomId,
        numberOfParts: Number.parseInt(req.body.numberOfParts),
        numberOfQuestions: Number.parseInt(req.body.numberOfQuestions),
    };
    const test = yield test_1.default.create(data);
    res.status(200).json(test);
})));
exports.default = uploadRouter;
