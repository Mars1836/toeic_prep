import express from "express";

import testRouter from "./test";
import { handleAsync } from "../../middlewares/handle_async";
import pubPaymentRouter from "./payment";
import uploadRouter from "./upload_test";

const routerP = express.Router();
routerP.use("/test", testRouter);
routerP.use("/payment", pubPaymentRouter);
routerP.use("/upload",uploadRouter)
export default routerP;
