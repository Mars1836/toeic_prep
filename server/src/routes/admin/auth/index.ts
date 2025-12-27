import express, { NextFunction, Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import { BadRequestError } from "../../../errors/bad_request_error";
import { requireAuth } from "../../../middlewares/require_auth";
import { AdminCtrl } from "../../../controllers/admin";
import { body } from "express-validator";
import { validate_request } from "../../../middlewares/validate_request";

const adminAuthRouter = express.Router();

// Login với JWT (giống user)
adminAuthRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  handleAsync(validate_request),
  handleAsync(AdminCtrl.login)
);

// Refresh token
adminAuthRouter.post("/refresh", handleAsync(AdminCtrl.refreshToken));

// Logout
adminAuthRouter.post(
  "/logout",
  handleAsync(requireAuth),
  handleAsync(AdminCtrl.logout)
);

// Get current admin
adminAuthRouter.get(
  "/current-user",
  handleAsync(requireAuth),
  handleAsync(AdminCtrl.getCurrentUser)
);

// Register admin
adminAuthRouter.post("/signup", handleAsync(AdminCtrl.localRegister));

export default adminAuthRouter;
