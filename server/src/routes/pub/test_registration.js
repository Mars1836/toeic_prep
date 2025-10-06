"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_registration_1 = __importDefault(require("../../controllers/test_registration"));
const handle_async_1 = require("../../middlewares/handle_async");
const router = express_1.default.Router();
// Get all registrations
router.get("/", (0, handle_async_1.handleAsync)(test_registration_1.default.getAll));
// Get registration by ID
router.get("/:id", (0, handle_async_1.handleAsync)(test_registration_1.default.getById));
// Get registrations by user ID
router.get("/user/:userId", (0, handle_async_1.handleAsync)(test_registration_1.default.getByUserId));
// Get upcoming registrations
router.get("/upcoming/all", (0, handle_async_1.handleAsync)(test_registration_1.default.getUpcomingRegistrations));
// Get registrations by date range
router.get("/date-range", (0, handle_async_1.handleAsync)(test_registration_1.default.getRegistrationsByDateRange));
// Create new registration
router.post("/", (0, handle_async_1.handleAsync)(test_registration_1.default.create));
// Update registration status
router.patch("/:id/status", (0, handle_async_1.handleAsync)(test_registration_1.default.updateStatus));
exports.default = router;
