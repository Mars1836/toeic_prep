import express, { NextFunction, Request, Response } from "express";
import { UserType } from "../../configs/interface";
import adminAuthRouter from "./auth";

const routerA = express.Router();
routerA.use("/auth", adminAuthRouter);
export default routerA;
