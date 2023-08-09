import ApiError from "../utils/ApiError.js";
import prisma from "../client.js";

const signup = async (userBody) => {
  const user = await prisma.user.create({
    data: {...userBody}
  })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new user");
  }

  return user;
};

const getAll = async() => {
  return prisma.user.findMany({});
}

export default { signup, getAll };