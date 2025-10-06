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
const cloudinary_1 = __importDefault(require("../../../configs/cloudinary")); // Cấu hình cloudinary từ file configs
const express_1 = require("express");
const handle_async_1 = require("../../../middlewares/handle_async");
const multer_1 = __importDefault(require("multer"));
const adminCloudinaryRouter = (0, express_1.Router)();
// Sử dụng Multer để xử lý file upload
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Endpoint upload hình ảnh lên Cloudinary
adminCloudinaryRouter.post("/upload-image", upload.single("image"), // Đặt tên field là "image"
(0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    // Đọc buffer của file upload
    const fileBuffer = req.file.buffer.toString("base64");
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer}`;
    try {
        // Upload hình ảnh lên Cloudinary
        const result = yield cloudinary_1.default.uploader.upload(base64Image, {
            folder: "admin_images", // Đặt folder Cloudinary
            use_filename: false, // Dùng tên file
            unique_filename: true, // Không tạo tên file ngẫu nhiên
        });
        // Trả về kết quả
        return res.status(200).json({
            message: "Image uploaded successfully",
            url: result.secure_url,
            public_id: result.public_id,
        });
    }
    catch (error) {
        console.error("Upload to Cloudinary failed:", error);
        return res.status(500).json({ error: "Failed to upload image" });
    }
})));
exports.default = adminCloudinaryRouter;
