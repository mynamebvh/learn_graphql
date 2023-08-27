import { tokenService, authService, userService } from "../services/index.js"
import { DateTimeResolver, UUIDResolver } from 'graphql-scalars';

export default {
  DateTime: DateTimeResolver,
  UUID: UUIDResolver,
  Query: {
    users: async(parent, args, ctx, info) => {
      const users = await userService.getAll();
      return users;
    } 
  },
  Mutation: {
    login: async(_, { username, password }, ctx) => {
      const user = await authService.login(username, password);
      const token = await tokenService.generateAuthTokens(user);
      return { accessToken: token }
    },
    signup: async(_, { fullName, password, username, email }, ctx) => {
      const user = await authService.signup({ fullName, password, username, email });
      return user;
    }
  }

}