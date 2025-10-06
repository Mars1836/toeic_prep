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
const blog_1 = __importDefault(require("../../../controllers/blog"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../../utils");
const fs_1 = __importDefault(require("fs"));
const adminBlogRouter = express_1.default.Router();
const uploadsDir = path_1.default.join(__dirname, "../../../uploads");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        if (file.fieldname === "image") {
            uploadPath = path_1.default.join(uploadsDir, "blog");
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
        const randomId = (0, utils_1.generateOTP)();
        cb(null, path_1.default.basename(randomId + file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
adminBlogRouter.post("/", (0, handle_async_1.handleAsync)(blog_1.default.createBlog));
adminBlogRouter.get("/", (0, handle_async_1.handleAsync)(blog_1.default.getBlog));
adminBlogRouter.get("/:id", (0, handle_async_1.handleAsync)(blog_1.default.getBlogById));
adminBlogRouter.put("/:id", (0, handle_async_1.handleAsync)(blog_1.default.updateBlog));
adminBlogRouter.delete("/:id", (0, handle_async_1.handleAsync)(blog_1.default.deleteBlog));
adminBlogRouter.post("/upload-image", upload.single("image"), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    const imageSrc = `/uploads/blog/${image === null || image === void 0 ? void 0 : image.filename}`;
    return res.status(200).json({ imageSrc });
})));
exports.default = adminBlogRouter;
