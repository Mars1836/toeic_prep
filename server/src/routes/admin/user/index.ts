import express from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import { userCtrl } from "../../../controllers/user";

const adminUserRouter = express.Router();
adminUserRouter.get("/", handleAsync(userCtrl.getAllUsers));
adminUserRouter.get("/upgrade", handleAsync(userCtrl.getUpgradeUsers));
export default adminUserRouter;
