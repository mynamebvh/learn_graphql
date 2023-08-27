import jwt from "jsonwebtoken";
import moment from "moment";
import ApiError from "../utils/ApiError.js";
import config from '../config/index.js';

const generateToken = (userId, expires, type, secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    "accessToken",
    config.jwt.secret
  );

  return accessToken
};

export default { generateAuthTokens };