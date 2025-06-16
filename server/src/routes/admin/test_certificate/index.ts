import express from "express";
import TestCertificateCtrl from "../../../controllers/test_certificate";
import { handleAsync } from "../../../middlewares/handle_async";

const adminTestCertificateRouter = express.Router();

// Get all certificates
adminTestCertificateRouter.get("/", handleAsync(TestCertificateCtrl.getAll));

// Get certificate by ID
adminTestCertificateRouter.get(
  "/:id",
  handleAsync(TestCertificateCtrl.getById)
);

// Get certificates by user ID
adminTestCertificateRouter.get(
  "/user/:userId",
  handleAsync(TestCertificateCtrl.getByUserId)
);

// Get valid certificates
adminTestCertificateRouter.get(
  "/valid/all",
  handleAsync(TestCertificateCtrl.getValidCertificates)
);

// Create new certificate
adminTestCertificateRouter.post("/", handleAsync(TestCertificateCtrl.create));

// Update certificate status
adminTestCertificateRouter.patch(
  "/:id/status",
  handleAsync(TestCertificateCtrl.updateStatus)
);

// Update certificate score
adminTestCertificateRouter.patch(
  "/:id/score",
  handleAsync(TestCertificateCtrl.updateScore)
);

export default adminTestCertificateRouter;
