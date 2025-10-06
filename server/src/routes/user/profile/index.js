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
const profile_1 = __importDefault(require("../../../controllers/profile"));
const user_1 = require("../../../controllers/user");
const user_2 = require("../../../services/user");
const uploadsDir = path_1.default.join(__dirname, "../../../uploads/profile");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const randomId = req.randomId;
        let uploadPath;
        if (file.fieldname === "avatar") {
            uploadPath = path_1.default.join(uploadsDir, "avatars");
        }
        else if (file.fieldname === "file") {
            uploadPath = path_1.default.join(uploadsDir, "files");
        }
        if (!uploadPath)
            return cb(new Error("Upload path is required"));
        fs_1.default.mkdirSync(uploadPath, { recursive: true }); // Create directory structure
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const fileExtension = path_1.default.extname(file.originalname); // Lấy phần mở rộng của file
        const randomFileName = `${req.randomId}_${Date.now()}${fileExtension}`; // Tạo tên ngẫu nhiên
        cb(null, randomFileName);
    },
});
const upload = (0, multer_1.default)({ storage });
const userProfileRouter = express_1.default.Router();
userProfileRouter.post("/update-avatar", (req, res, next) => {
    req.randomId = (0, utils_1.generateOTP)().toString(); // Tạo randomId mới
    next();
}, upload.fields([{ name: "avatar" }]), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const avatar = "/uploads/profile/avatars/" + ((_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar[0].filename);
    const updatedUser = yield user_2.userSrv.updateAvatar(user.id, avatar);
    res.status(200).json(avatar);
})));
userProfileRouter.post("/upload-file", (req, res, next) => {
    req.randomId = (0, utils_1.generateOTP)().toString(); // Tạo randomId mới
    next();
}, upload.fields([{ name: "file" }]), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = "/uploads/profile/files/" + ((_a = req.files) === null || _a === void 0 ? void 0 : _a.file[0].filename);
    res.status(200).json(url);
})));
userProfileRouter.post("/update-profile", (0, handle_async_1.handleAsync)(user_1.userCtrl.updateProfile));
userProfileRouter.get("/analysis", (0, handle_async_1.handleAsync)(profile_1.default.getAnalyst));
userProfileRouter.post("/update-target-score", (0, handle_async_1.handleAsync)(user_1.userCtrl.updateTargetScore));
userProfileRouter.get("/recommend", (0, handle_async_1.handleAsync)(profile_1.default.getSuggestForStudy));
exports.default = userProfileRouter;
