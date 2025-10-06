"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const test_1 = __importDefault(require("../../../controllers/test"));
const testRouter = express_1.default.Router();
testRouter.get("/", (0, handle_async_1.handleAsync)(test_1.default.getByQuery));
// testRouter.get("/handleTest", handleAsync(TestCtrl.handleTest));
testRouter.get("/handle-excel", (0, handle_async_1.handleAsync)(test_1.default.handleExcel));
testRouter.get("/code", (0, handle_async_1.handleAsync)(test_1.default.getByCode));
testRouter.get("/id", (0, handle_async_1.handleAsync)(test_1.default.getById));
testRouter.patch("/all", (0, handle_async_1.handleAsync)(test_1.default.updateAll));
// testRouter.get("/code", handleAsync(TestCtrl.getByCode));
// testRouter.get("/exam", handleAsync(TestCtrl.handleTest2));
exports.default = testRouter;
