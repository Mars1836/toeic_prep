import express from "express";

import testRouter from "./test";
import { handleAsync } from "../../middlewares/handle_async";
import pubPaymentRouter from "./payment";
import uploadRouter from "./upload_test";
import wordRouter from "./word";
import pubBlogRouter from "./blog";
import pubTranscriptTestRouter from "./transcript_test";
import pubTranscriptTestItemRouter from "./transcript_test_item";
import testRegistrationRouter from "./test_registration";
import { RateLimitInstance } from "../../middlewares/rate_limit";
import bridgeNestRouter from "../user/bridge_nest";
import { requireAuth } from "../../middlewares/require_auth";
import csrfRouter from "./csrf.routes";

const routerP = express.Router();

// CSRF Token endpoint (không cần rate limit vì chỉ generate token)
routerP.use("/csrf-token", csrfRouter);

routerP.use("/test", RateLimitInstance.createDualLowMediumMiddleware(), testRouter);
routerP.use(
  "/payment",
  RateLimitInstance.createHighLimitMiddleware(),
  pubPaymentRouter
);
routerP.use(
  "/upload",
  RateLimitInstance.createHighLimitMiddleware(),
  uploadRouter
);
routerP.use("/word", RateLimitInstance.createHighLimitMiddleware(), wordRouter);
routerP.use(
  "/blog",
  RateLimitInstance.createHighLimitMiddleware(),
  pubBlogRouter
);
routerP.use(
  "/transcript-test",
  RateLimitInstance.createHighLimitMiddleware(),
  pubTranscriptTestRouter
);
routerP.use(
  "/transcript-test-item",
  RateLimitInstance.createHighLimitMiddleware(),
  pubTranscriptTestItemRouter
);
routerP.use(
  "/registration",
  RateLimitInstance.createHighLimitMiddleware(),
  testRegistrationRouter
);


export default routerP;

