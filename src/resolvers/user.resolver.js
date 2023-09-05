import fs from 'fs';
import { tokenService, authService, userService } from "../services/index.js"
import { DateTimeResolver, UUIDResolver } from 'graphql-scalars';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

export default {
  DateTime: DateTimeResolver,
  UUID: UUIDResolver,
  Upload: GraphQLUpload,
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
      pubsub.publish('USER_CREATED', { userCreated: user }); 
      return user;
    },
    // updateUser: async(_, { fullName, password, username, email }, ctx) => {},
    // deleteuser: async(_, { fullName, password, username, email }, ctx) => {},
    uploadImage: async(_, { image } , ctx) => {
      const { filename, createReadStream } = await image;
      const targetDirectory = './src/uploads/';
      const readStream = createReadStream();
      const writeStream = fs.createWriteStream(targetDirectory + filename);
      readStream.pipe(writeStream);

      writeStream.on('finish', () => {
        
      });
    
      writeStream.on('error', (err) => {
      });
      
      return filename
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(['USER_CREATED']),
    }
  }

}