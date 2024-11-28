//@ts-nocheck
import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import multer from "multer";
import fs from "fs";
import path from "path";
import { generateOTP } from "../../../utils";
import { testModel } from "../../../models/test.model";
import TestSrv from "../../../services/test";
import ProfileCtrl from "../../../controllers/profile";
const uploadsDir = path.join(__dirname, "../../../uploads/profile");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const randomId = req.randomId;
    let uploadPath;
    if (file.fieldname === "avatar") {
      uploadPath = path.join(uploadsDir, "avatars");
    }
    if (!uploadPath) return cb(new Error("Upload path is required"));
    fs.mkdirSync(uploadPath!, { recursive: true }); // Create directory structure
    cb(null, uploadPath!);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Lấy phần mở rộng của file
    const randomFileName = `${req.randomId}_${Date.now()}${fileExtension}`; // Tạo tên ngẫu nhiên
    cb(null, randomFileName);
  },
});
const upload = multer({ storage });

const userProfileRouter = express.Router();
userProfileRouter.post(
  "/update",
  (req: Request, res: Response, next) => {
    req.randomId = generateOTP().toString(); // Tạo randomId mới

    next();
  },
  upload.fields([{ name: "avatar" }]),
  handleAsync(async (req: Request, res: Response) => {
    res.json({ message: "success" });
  })
);

userProfileRouter.get("/analysis", handleAsync(ProfileCtrl.getAnalyst));
export default userProfileRouter;
