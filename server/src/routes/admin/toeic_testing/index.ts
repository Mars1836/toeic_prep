import express from "express";
import ToeicTestingCtrl from "../../../controllers/toeic_testing";
import { handleAsync } from "../../../middlewares/handle_async";

const router = express.Router();

// Get all tests
router.get("/", handleAsync(ToeicTestingCtrl.getAll));

// Get test by ID
router.get("/:id", handleAsync(ToeicTestingCtrl.getById));

// Get tests with filters
router.get("/filter/all", handleAsync(ToeicTestingCtrl.getTestsByFilter));

// Create new test
router.post("/", handleAsync(ToeicTestingCtrl.create));

// Create multiple tests
router.post("/batch", handleAsync(ToeicTestingCtrl.createMany));

export default router;
