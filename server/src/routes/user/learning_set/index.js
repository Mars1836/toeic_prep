"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const learning_set_1 = __importDefault(require("../../../controllers/learning_set"));
const learingSetRouter = express_1.default.Router();
learingSetRouter.post("/", (0, handle_async_1.handleAsync)(learning_set_1.default.addSetToLearn));
learingSetRouter.delete("/", (0, handle_async_1.handleAsync)(learning_set_1.default.removeSetFromLearn));
learingSetRouter.get("/user", (0, handle_async_1.handleAsync)(learning_set_1.default.getLearningSetByUser));
learingSetRouter.get("/set", (0, handle_async_1.handleAsync)(learning_set_1.default.getLearningSetBySetId));
learingSetRouter.get("/id", (0, handle_async_1.handleAsync)(learning_set_1.default.getLearningSetById));
exports.default = learingSetRouter;
