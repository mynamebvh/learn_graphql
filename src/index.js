import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import express from "express";
import http from "http";
import cors from 'cors'
import pkg from "body-parser";

const { json } = pkg;

import schema from "./schema/index.js";
import prisma from "./client.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import resolvers from './resolvers/index.js';
import authDirectiveTransformer from './directives/auth.directive.js'

const app = express();
const httpServer = http.createServer(app);
const { protect } = authMiddleware;

let schemaExec = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

schemaExec = authDirectiveTransformer(schemaExec);

const server = new ApolloServer({
  schema: schemaExec,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  // introspection: true,
});

await server.start();

prisma.$connect().then(async() => {
  console.log('Connected to SQL Database');
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});

app.use(
  "/graphql",
  cors(),
  json(),
  graphqlUploadExpress({ maxFileSize: 100000 }),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = await protect(req);
      return auth
    },
  })
);


