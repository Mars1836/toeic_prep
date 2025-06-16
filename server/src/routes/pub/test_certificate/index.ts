import express from "express";
import TestCertificateCtrl from "../../../controllers/test_certificate";
import { handleAsync } from "../../../middlewares/handle_async";

const router = express.Router();

// Get all certificates
router.get("/", handleAsync(TestCertificateCtrl.getAll));

// Get certificate by ID
router.get("/:id", handleAsync(TestCertificateCtrl.getById));

// Get certificates by user ID
router.get("/user/:userId", handleAsync(TestCertificateCtrl.getByUserId));

// Get valid certificates
router.get("/valid/all", handleAsync(TestCertificateCtrl.getValidCertificates));

// Create new certificate
router.post("/", handleAsync(TestCertificateCtrl.create));

// Update certificate status
router.patch("/:id/status", handleAsync(TestCertificateCtrl.updateStatus));

// Update certificate score
router.patch("/:id/score", handleAsync(TestCertificateCtrl.updateScore));

export default router;
