"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_registration_1 = __importDefault(require("../../../controllers/test_registration"));
const handle_async_1 = require("../../../middlewares/handle_async");
const router = (0, express_1.Router)();
// User routes
router.post("/", (0, handle_async_1.handleAsync)(test_registration_1.default.create));
router.get("", (0, handle_async_1.handleAsync)(test_registration_1.default.getByUserId));
router.get("/upcoming", (0, handle_async_1.handleAsync)(test_registration_1.default.getUpcomingRegistrations));
router.get("/:id", (0, handle_async_1.handleAsync)(test_registration_1.default.getById));
router.patch("/:id/cancel", (0, handle_async_1.handleAsync)(test_registration_1.default.cancelRegistration));
exports.default = router;
