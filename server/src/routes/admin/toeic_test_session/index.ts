import express from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import { requireAuth } from "../../../middlewares/require_auth";
import ToeicTestSessionCtrl from "../../../controllers/toeic_test_session";

const adminToeicTestSessionRouter = express.Router();

// Get all sessions with pagination
adminToeicTestSessionRouter.get("/", handleAsync(ToeicTestSessionCtrl.getAll));

// Get session by ID
adminToeicTestSessionRouter.get(
  "/:id",

  handleAsync(ToeicTestSessionCtrl.getById)
);

// Create new session
adminToeicTestSessionRouter.post("/", handleAsync(ToeicTestSessionCtrl.create));

// Update session
adminToeicTestSessionRouter.put(
  "/:id",
  handleAsync(ToeicTestSessionCtrl.update)
);

// Delete session
adminToeicTestSessionRouter.delete(
  "/:id",
  handleAsync(ToeicTestSessionCtrl.deleteSession)
);

// Add participant to session
adminToeicTestSessionRouter.post(
  "/:id/participants",
  handleAsync(ToeicTestSessionCtrl.addParticipant)
);

// Remove participant from session
adminToeicTestSessionRouter.delete(
  "/:id/participants",
  handleAsync(ToeicTestSessionCtrl.removeParticipant)
);

// Get sessions by test ID
adminToeicTestSessionRouter.get(
  "/test/:testId",
  handleAsync(ToeicTestSessionCtrl.getSessionsByTestId)
);

// Get sessions by testing ID
adminToeicTestSessionRouter.get(
  "/testing/:testingId",
  handleAsync(ToeicTestSessionCtrl.getSessionsByTestingId)
);

// Get sessions by user ID
adminToeicTestSessionRouter.get(
  "/user/:userId",
  handleAsync(ToeicTestSessionCtrl.getSessionsByUserId)
);

export default adminToeicTestSessionRouter;
