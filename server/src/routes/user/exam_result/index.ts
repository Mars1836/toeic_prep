import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import ExamResultCtrl from "../../../controllers/exam_result";
const userExamResultRouter = express.Router();
userExamResultRouter.post(
  "/items",
  handleAsync(ExamResultCtrl.creataWithItems)
);

export default userExamResultRouter;
