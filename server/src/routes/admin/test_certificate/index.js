"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_certificate_1 = __importDefault(require("../../../controllers/test_certificate"));
const handle_async_1 = require("../../../middlewares/handle_async");
const adminTestCertificateRouter = express_1.default.Router();
// Get all certificates
adminTestCertificateRouter.get("/", (0, handle_async_1.handleAsync)(test_certificate_1.default.getAll));
// Get certificate by ID
adminTestCertificateRouter.get("/:id", (0, handle_async_1.handleAsync)(test_certificate_1.default.getById));
// Get certificates by user ID
adminTestCertificateRouter.get("/user/:userId", (0, handle_async_1.handleAsync)(test_certificate_1.default.getByUserId));
// Get valid certificates
adminTestCertificateRouter.get("/valid/all", (0, handle_async_1.handleAsync)(test_certificate_1.default.getValidCertificates));
// Create new certificate
adminTestCertificateRouter.post("/", (0, handle_async_1.handleAsync)(test_certificate_1.default.create));
// Update certificate status
adminTestCertificateRouter.patch("/:id/status", (0, handle_async_1.handleAsync)(test_certificate_1.default.updateStatus));
// Update certificate score
adminTestCertificateRouter.patch("/:id/score", (0, handle_async_1.handleAsync)(test_certificate_1.default.updateScore));
exports.default = adminTestCertificateRouter;
