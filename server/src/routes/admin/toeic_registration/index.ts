import { Router } from "express";
import TestRegistrationCtrl from "../../../controllers/test_registration";

const adminTestRegistrationRouter = Router();

// Admin routes
adminTestRegistrationRouter.get("/", TestRegistrationCtrl.getAll);
adminTestRegistrationRouter.get("/:id", TestRegistrationCtrl.getById);
adminTestRegistrationRouter.patch(
  "/:id/status",
  TestRegistrationCtrl.updateStatus
);
adminTestRegistrationRouter.get(
  "/date-range",
  TestRegistrationCtrl.getRegistrationsByDateRange
);
adminTestRegistrationRouter.get(
  "/status/:status",
  TestRegistrationCtrl.getRegistrationsByStatus
);
adminTestRegistrationRouter.get(
  "/test-center/:testCenter",
  TestRegistrationCtrl.getRegistrationsByTestCenter
);

export default adminTestRegistrationRouter;
