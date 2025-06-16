import express from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import { requireAuth } from "../../../middlewares/require_auth";
import ToeicTestSessionCtrl from "../../../controllers/toeic_test_session";

const userToeicTestSessionRouter = express.Router();

// Get user's own sessions
userToeicTestSessionRouter.get(
  "/my-sessions",
  handleAsync(requireAuth),
  handleAsync(ToeicTestSessionCtrl.getMySessions)
);
userToeicTestSessionRouter.get(
  "/exam",
  handleAsync(requireAuth),
  handleAsync(ToeicTestSessionCtrl.getExamByToken)
);
userToeicTestSessionRouter.get(
  "/my-sessions/:id",
  handleAsync(requireAuth),
  handleAsync(ToeicTestSessionCtrl.getSessionByUserIdAndId)
);

export default userToeicTestSessionRouter;
