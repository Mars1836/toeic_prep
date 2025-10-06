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
// Cấu hình lưu trữ tệp
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const randomId = req.randomId;
        let uploadPath;
        if (file.fieldname === "images") {
            uploadPath = path_1.default.join(uploadsDir, "images", randomId);
        }
        else if (file.fieldname === "audioFiles") {
            uploadPath = path_1.default.join(uploadsDir, "audios", randomId);
        }
        else if (file.fieldname === "excelFile") {
            uploadPath = path_1.default.join(uploadsDir, "excels", randomId);
        }
        // Tạo thư mục nếu chưa tồn tại
        try {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        }
        catch (err) {
            cb(err, "");
        }
    },
    filename: (req, file, cb) => {
        // Lưu tên tệp gốc, đảm bảo an toàn
        cb(null, path_1.default.basename(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const adminTestRouter = express_1.default.Router();
adminTestRouter.post("/", (req, res, next) => {
    req.randomId = (0, utils_1.generateOTP)().toString(); // Tạo randomId mới
    next();
}, upload.fields([
    { name: "images" },
    { name: "audioFiles" },
    { name: "excelFile" },
]), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Kiểm tra và gán dữ liệu từ `req.body`
    let { title, type, parts, numberOfQuestions, isPublished, difficulty, duration, } = req.body;
    if (!title || !type || !parts || !numberOfQuestions || !duration) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    parts = JSON.parse(parts);
    // Kiểm tra xem tệp có được tải lên hay không
    const files = req.files;
    if (!files || !files.excelFile || !files.excelFile[0]) {
        return res.status(400).json({ message: "Excel file is required" });
    }
    const data = {
        title: title,
        type: type,
        parts: parts,
        path: files.excelFile[0].filename, // Lưu đường dẫn tệp Excel
        code: req.randomId, // Mã randomId
        numberOfParts: parts.length,
        numberOfQuestions: Number.parseInt(numberOfQuestions),
        isPublished: isPublished,
        difficulty: difficulty,
        duration: duration,
        fileName: files.excelFile[0].filename,
    };
    try {
        const test = yield test_1.default.create(data); // Lưu thông tin vào database
        res.status(200).json(test);
    }
    catch (err) {
        res.status(500).json({ message: "Error creating test", error: err });
    }
})));
adminTestRouter.get("/", (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield test_1.default.getAll();
    res.status(200).json(test);
})));
adminTestRouter.get("/:id", (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield test_1.default.getById(req.params.id);
    res.status(200).json(test);
})));
adminTestRouter.patch("/:id/infor", (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield test_1.default.updateTest(req.params.id, req.body);
    res.status(200).json(test);
})));
adminTestRouter.patch("/:id/data", (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const test = await TestSrv.updateTestData(req.params.id, req.body);
    res.status(200).json(1);
})));
adminTestRouter.delete("/:id", (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield test_1.default.deleteTest(req.params.id);
    res.status(200).json(test);
})));
exports.default = adminTestRouter;
