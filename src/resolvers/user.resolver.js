import userService from "../services/user.service.js"
import { DateTimeResolver, UUIDResolver } from 'graphql-scalars';

export default {
  DateTime: DateTimeResolver,
  UUID: UUIDResolver,
  Query: {
    users: async() => {
      const users = await userService.getAll();
      return users;
    } 
  },
  Mutation: {
    signup: async(_, { fullName, password, username, email }, ctx) => {
      const user = await userService.signup({ fullName, password, username, email });
      return user;
    }

  }

}