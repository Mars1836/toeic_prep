import express from "express";

import testRouter from "./test";
import { handleAsync } from "../../middlewares/handle_async";
import pubPaymentRouter from "./payment";
import uploadRouter from "./upload_test";
import wordRouter from "./word";
const routerP = express.Router();
routerP.use("/test", testRouter);
routerP.use("/payment", pubPaymentRouter);
routerP.use("/upload", uploadRouter);
routerP.use("/word", wordRouter);
export default routerP;
