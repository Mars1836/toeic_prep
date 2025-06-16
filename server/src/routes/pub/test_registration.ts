import express from "express";
import TestRegistrationCtrl from "../../controllers/test_registration";
import { handleAsync } from "../../middlewares/handle_async";

const router = express.Router();

// Get all registrations
router.get("/", handleAsync(TestRegistrationCtrl.getAll));

// Get registration by ID
router.get("/:id", handleAsync(TestRegistrationCtrl.getById));

// Get registrations by user ID
router.get("/user/:userId", handleAsync(TestRegistrationCtrl.getByUserId));

// Get upcoming registrations
router.get(
  "/upcoming/all",
  handleAsync(TestRegistrationCtrl.getUpcomingRegistrations)
);

// Get registrations by date range
router.get(
  "/date-range",
  handleAsync(TestRegistrationCtrl.getRegistrationsByDateRange)
);

// Create new registration
router.post("/", handleAsync(TestRegistrationCtrl.create));

// Update registration status
router.patch("/:id/status", handleAsync(TestRegistrationCtrl.updateStatus));

export default router;
