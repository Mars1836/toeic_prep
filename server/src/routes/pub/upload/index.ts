import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import multer from 'multer'
import fs from 'fs'
 import path from "path"
import { generateOTP } from "../../../utils";
 const uploadsDir = path.join(__dirname, '../../../uploads');
 let randomId = generateOTP().toString()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath 
    if (file.fieldname === 'audioFiles') {
      uploadPath = path.join(uploadsDir, 'audio',randomId); // Thư mục cho audio
    } else if (file.fieldname === 'documentFiles') {
      uploadPath = path.join(uploadsDir, 'documents',randomId); // Thư mục cho documents
    }
    fs.mkdirSync(uploadPath!, { recursive: true }); // Create directory structure
    cb(null, uploadPath!);
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  },
});
const upload = multer({ storage });

const uploadRouter = express.Router();
uploadRouter.post(
  "/",
  upload.fields([{ name: 'audioFiles' }, { name: 'documentFiles' }]),handleAsync(async (req: Request, res: Response) => {
     try {
      // Log đường dẫn của các file đã được upload
      //@ts-ignore   
      res.status(200).json({
        a:1
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).send('Upload failed');
    }
  })
);

export default uploadRouter;
