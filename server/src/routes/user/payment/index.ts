import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import PaymentCtrl from "../../../controllers/payment";

const userPaymentRouter = express.Router();
userPaymentRouter.post("/", handleAsync(PaymentCtrl.create));
userPaymentRouter.post(
  "/test-registration",
  handleAsync(PaymentCtrl.registration)
);

userPaymentRouter.get("/status", handleAsync(PaymentCtrl.getStatus));

export default userPaymentRouter;
