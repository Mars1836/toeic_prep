import express, { NextFunction, Request, Response } from "express";
import { UserType } from "../../configs/interface";
import adminAuthRouter from "./auth";
import adminTransactionRouter from "./transaction";
import adminBlogRouter from "./blog";
import adminAnalysisRouter from "./analysis";
import adminUserRouter from "./user";
import adminTestRouter from "./test";
import adminResultRouter from "./result";
import adminCloudinaryRouter from "./cloudinary";
import { requireAuth } from "../../middlewares/require_auth";
import { handleAsync } from "../../middlewares/handle_async";
import adminTestCertificateRouter from "./test_certificate";
import adminToeicTestingRouter from "./toeic_testing";
import adminTestRegistrationRouter from "./toeic_registration";
import adminToeicTestSessionRouter from "./toeic_test_session";
const routerA = express.Router();
routerA.use("/auth", adminAuthRouter);
routerA.use("/transaction", handleAsync(requireAuth), adminTransactionRouter);
routerA.use("/blog", handleAsync(requireAuth), adminBlogRouter);
routerA.use("/analysis", handleAsync(requireAuth), adminAnalysisRouter);
routerA.use("/user", handleAsync(requireAuth), adminUserRouter);
routerA.use("/test", handleAsync(requireAuth), adminTestRouter);
routerA.use("/result", handleAsync(requireAuth), adminResultRouter);
routerA.use("/cloudinary", handleAsync(requireAuth), adminCloudinaryRouter);
routerA.use(
  "/test-certificate",
  handleAsync(requireAuth),
  adminTestCertificateRouter
);
routerA.use(
  "/toeic-testing",
  handleAsync(requireAuth),
  adminToeicTestingRouter
);
routerA.use(
  "/test-registration",
  handleAsync(requireAuth),
  adminTestRegistrationRouter
);
routerA.use(
  "/toeic-test-session",
  handleAsync(requireAuth),
  adminToeicTestSessionRouter
);

export default routerA;
