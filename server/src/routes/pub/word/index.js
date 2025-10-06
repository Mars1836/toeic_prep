"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const word_1 = __importDefault(require("../../../controllers/word"));
const wordRouter = express_1.default.Router();
wordRouter.get("/4-random", (0, handle_async_1.handleAsync)(word_1.default.get4RandomWords));
wordRouter.post("/many", (0, handle_async_1.handleAsync)(word_1.default.createMany));
exports.default = wordRouter;
