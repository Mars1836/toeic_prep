import express from "express";
import ToeicTestingCtrl from "../../../controllers/toeic_testing";
import { handleAsync } from "../../../middlewares/handle_async";

const userToeicTestingRouter = express.Router();

userToeicTestingRouter.get(
  "/pending",
  handleAsync(ToeicTestingCtrl.getPendingTestsByUser)
);

export default userToeicTestingRouter;
