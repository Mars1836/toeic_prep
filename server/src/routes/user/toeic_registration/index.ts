import { Router } from "express";
import TestRegistrationCtrl from "../../../controllers/test_registration";
import { handleAsync } from "../../../middlewares/handle_async";

const router = Router();

// User routes
router.post("/", handleAsync(TestRegistrationCtrl.create));
router.get("", handleAsync(TestRegistrationCtrl.getByUserId));
router.get(
  "/upcoming",
  handleAsync(TestRegistrationCtrl.getUpcomingRegistrations)
);
router.get("/:id", handleAsync(TestRegistrationCtrl.getById));
router.patch(
  "/:id/cancel",
  handleAsync(TestRegistrationCtrl.cancelRegistration)
);

export default router;
