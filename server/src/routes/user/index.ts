import express from "express";
import { UserType } from "../../configs/interface";
import userAuthRouter from "./auth";

declare global {
  namespace Express {
    interface Request {
      admin?: UserType; // Add the clientUser property (replace UserType with the correct type)
      // user?: UserType; // Add the user property from the User interface
    }
  }
}

const routerU = express.Router();
routerU.use("/auth", userAuthRouter);

export default routerU;
