import { validationResult } from "express-validator";
import { UserAttr, userModel } from "../../models/user.model";
import { Request, Response } from "express";
import { RequestValidationError } from "../../errors/request_validation_error";
import { NotAuthorizedError } from "../../errors/not_authorized_error";
import { userSrv } from "../../services/user";

async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password } = req.body;
  const user = await userSrv.localLogin({ email, password });
  res.status(200).json(user);
}
async function getCurrentUser(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    throw new NotAuthorizedError();
  }
  res.status(200).json(user);
}
async function logout(req: Request, res: Response) {
  req.session = null;
  res.status(200).json({});
}
export const userCtrl = {
  logout,
  getCurrentUser,
};
