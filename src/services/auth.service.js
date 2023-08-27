import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import prisma from "../client.js";
import userService from "./user.service.js";
import ApiError from "../utils/ApiError.js";
import { encryptPassword } from '../utils/encryption.js';

const login = async (account, password) => {
  const user = await userService.getUserByAccount(account);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "user account or password incorrect"
    );
  }

  return user;
};

const signup = async (userBody) => {
  const user = await prisma.user.create({
    data: {...userBody, password: await encryptPassword(userBody.password)}
  })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new user");
  }

  return user;
};

export default { login, signup };