"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const toeic_testing_1 = __importDefault(require("../../../controllers/toeic_testing"));
const handle_async_1 = require("../../../middlewares/handle_async");
const router = express_1.default.Router();
// Get all tests
router.get("/", (0, handle_async_1.handleAsync)(toeic_testing_1.default.getAll));
// Get test by ID
router.get("/:id", (0, handle_async_1.handleAsync)(toeic_testing_1.default.getById));
// Get tests with filters
router.get("/filter/all", (0, handle_async_1.handleAsync)(toeic_testing_1.default.getTestsByFilter));
// Create new test
router.post("/", (0, handle_async_1.handleAsync)(toeic_testing_1.default.create));
// Create multiple tests
router.post("/batch", (0, handle_async_1.handleAsync)(toeic_testing_1.default.createMany));
exports.default = router;
