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
import { requireAdmin } from "../../middlewares/require_admin";
import { handleAsync } from "../../middlewares/handle_async";
import adminTestCertificateRouter from "./test_certificate";
import adminToeicTestingRouter from "./toeic_testing";
import adminTestRegistrationRouter from "./toeic_registration";
import adminToeicTestSessionRouter from "./toeic_test_session";

const routerA = express.Router();

routerA.use("/auth", adminAuthRouter);
routerA.use("/transaction", handleAsync(requireAdmin), adminTransactionRouter);
routerA.use("/blog", handleAsync(requireAdmin), adminBlogRouter);
routerA.use("/analysis", handleAsync(requireAdmin), adminAnalysisRouter);
routerA.use("/user", handleAsync(requireAdmin), adminUserRouter);
routerA.use("/test", handleAsync(requireAdmin), adminTestRouter);
routerA.use("/result", handleAsync(requireAdmin), adminResultRouter);
routerA.use("/cloudinary", handleAsync(requireAdmin), adminCloudinaryRouter);
routerA.use(
  "/test-certificate",
  handleAsync(requireAdmin),
  adminTestCertificateRouter
);
routerA.use(
  "/toeic-testing",
  handleAsync(requireAdmin),
  adminToeicTestingRouter
);
routerA.use(
  "/test-registration",
  handleAsync(requireAdmin),
  adminTestRegistrationRouter
);
routerA.use(
  "/toeic-test-session",
  handleAsync(requireAdmin),
  adminToeicTestSessionRouter
);

export default routerA;
