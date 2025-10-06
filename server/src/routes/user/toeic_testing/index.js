"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const toeic_testing_1 = __importDefault(require("../../../controllers/toeic_testing"));
const handle_async_1 = require("../../../middlewares/handle_async");
const userToeicTestingRouter = express_1.default.Router();
userToeicTestingRouter.get("/pending", (0, handle_async_1.handleAsync)(toeic_testing_1.default.getPendingTestsByUser));
exports.default = userToeicTestingRouter;
