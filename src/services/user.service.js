import ApiError from "../utils/ApiError.js";
import prisma from "../client.js";

const getAll = async() => {
  return prisma.user.findMany({});
}

const getUserByAccount = async (account) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: account }, { email: account }],
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  return user;
};

export default { getAll, getUserByAccount };