import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not_authorized_error";
import { requireAuth } from "./require_auth";
import { userModel } from "../models/user.model";   

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await requireAuth(req, res, () => {});
  // @ts-ignore
  const user = await userModel.findById(req.user?.id).exec();
  // @ts-ignore
  if (!user || user.role !== 'admin') {
    throw new NotAuthorizedError("Admin access required");
  }

  return next();
}
