import express, { NextFunction, Request, Response } from "express";
import { UserType } from "../../configs/interface";
import adminAuthRouter from "./auth";

declare global {
  namespace Express {
    interface Request {
      admin?: UserType; // Add the adminUser property
      // user?: UserType; // Add the user property from the User interface
    }
  }
}

const routerA = express.Router();
routerA.use("/auth", adminAuthRouter);
export default routerA;
