import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import TestCtrl from "../../../controllers/test";

const testRouter = express.Router();
testRouter.get("/", handleAsync(TestCtrl.getAll));
testRouter.get("/handleTest", handleAsync(TestCtrl.handleTest));
testRouter.get("/handleTest2", handleAsync(TestCtrl.handleTest2));
export default testRouter;
