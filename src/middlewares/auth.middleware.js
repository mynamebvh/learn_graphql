import jwt from "jsonwebtoken";
import prisma from "../client.js";
import config from "../config/index.js";

const protect = async (req) => {
  try {
    // let token = null;
    // if (req.headers.authorization?.startsWith("Bearer")) {
    //   token = req.headers.authorization.split(" ")[1];
    // }

    // if (!token) {
    //   return { isAuth: false };
    // }

    // const decodedToken = jwt.verify(token, config.jwt.secret);
    // const { sub: userId } = decodedToken;

    const user = await prisma.user.findUnique({
      where: {
        id: "9959cc61-492a-44d9-8786-9199a170cca0",
      },
    });

    if (!user) {
      return { isAuth: false };
    }

    return { isAuth: true, user };
  } catch (error) {
    throw new Error("token not valid");
  }
};

export default { protect };
