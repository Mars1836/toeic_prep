import { UserAttr, userModel, UserTargetScore } from "../../models/user.model";
import bcrypt from "bcrypt";
import * as _ from "lodash";
import jwt from "jsonwebtoken";
import { constEnv } from "../../configs/const";
import { BadRequestError } from "../../errors/bad_request_error";
async function localCreate(data: {
  email: string;
  password: string;
  name: string;
}) {
  const checkEmail = await userModel.findOne({ email: data.email });

  if (checkEmail) {
    throw new BadRequestError("Email in use");
  }
  data.password = await bcrypt.hash(
    data.password,
    parseInt(constEnv.passwordSalt!)
  );
  // Store hash in your password DB.
  const user = await userModel.create(data);

  return user;
}
async function googleCreate(data: {
  googleId: string;
  name: string;
  email: string;
}) {
  const user = await userModel.create(data);
  return user;
}
async function facebookCreate(data: { facebookId: string; name: string }) {
  const user = await userModel.create(data);
  return user;
}
async function localLogin(data: { email: string; password: string }) {
  const user = await userModel.findOne({
    email: data.email,
  });
  if (!user) {
    throw new BadRequestError("Email or password is wrong");
  }
  const verify = await bcrypt.compare(data.password, user.password as string);

  if (!verify) {
    throw new BadRequestError("Email or password is wrong");
  }

  return user;
}
async function updateAvatar(id: string, avatar: string) {
  const user = await userModel.findByIdAndUpdate(id, { avatar }, { new: true });
  return user;
}
async function updateProfile(id: string, data: { name: string; bio: string }) {
  const user = await userModel.findByIdAndUpdate(id, data, { new: true });
  return user;
}
export async function getById(id: string) {
  const user = await userModel.findById(id).select("-password");
  return user;
}
export async function updateTargetScore(
  id: string,
  { reading, listening }: { reading: number; listening: number }
) {
  const targetScore = {
    reading,
    listening,
  };
  const user = await userModel.findByIdAndUpdate(
    id,
    { targetScore },
    {
      new: true,
    }
  );
  return user;
}
export async function getAllUsers() {
  const users = await userModel.find({}).select("-password");
  const data = users.map((user) => {
    return {
      ...user.toObject(),
      isUpgrade:
        user.upgradeExpiredDate &&
        new Date(user.upgradeExpiredDate) > new Date()
          ? true
          : false,
    };
  });
  return data;
}
export async function getUpgradeUsers() {
  const users = await userModel.find({
    upgradeExpiredDate: { $gt: new Date() },
  });
  return users;
}
export const userSrv = {
  localCreate,
  localLogin,
  googleCreate,
  facebookCreate,
  getById,
  updateProfile,
  updateAvatar,
  updateTargetScore,
  getAllUsers,
  getUpgradeUsers,
};
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, parseInt(constEnv.passwordSalt!));
}
