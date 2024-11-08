import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import ResultCtrl from "../../../controllers/result";
const userResultRouter = express.Router();
userResultRouter.post("/items", handleAsync(ResultCtrl.creataWithItems));
userResultRouter.post("/", handleAsync(ResultCtrl.create));
userResultRouter.get("/test", handleAsync(ResultCtrl.getByTest));
userResultRouter.get("/user", handleAsync(ResultCtrl.getByUser));
export default userResultRouter;
