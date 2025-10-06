"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const payment_1 = __importDefault(require("../../../controllers/payment"));
const pubPaymentRouter = express_1.default.Router();
pubPaymentRouter.post("/callback", (0, handle_async_1.handleAsync)(payment_1.default.callback));
exports.default = pubPaymentRouter;
