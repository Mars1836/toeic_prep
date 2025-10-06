"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_registration_1 = __importDefault(require("../../../controllers/test_registration"));
const adminTestRegistrationRouter = (0, express_1.Router)();
// Admin routes
adminTestRegistrationRouter.get("/", test_registration_1.default.getAll);
adminTestRegistrationRouter.get("/:id", test_registration_1.default.getById);
adminTestRegistrationRouter.patch("/:id/status", test_registration_1.default.updateStatus);
adminTestRegistrationRouter.get("/date-range", test_registration_1.default.getRegistrationsByDateRange);
adminTestRegistrationRouter.get("/status/:status", test_registration_1.default.getRegistrationsByStatus);
adminTestRegistrationRouter.get("/test-center/:testCenter", test_registration_1.default.getRegistrationsByTestCenter);
exports.default = adminTestRegistrationRouter;
