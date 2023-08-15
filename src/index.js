import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import pkg from "body-parser";

const { json } = pkg;

import schema1 from "./schema/index.js";
import prisma from "./client.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import resolvers from './resolvers/index.js';
import authDirectiveTransformer from './directives/auth.directive.js'

const app = express();
const httpServer = http.createServer(app);
const { protect } = authMiddleware;

let schema = makeExecutableSchema({
  typeDefs: schema1,
  resolvers,
});

schema = authDirectiveTransformer(schema);

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true
});

await server.start();

prisma.$connect().then(async() => {
  console.log('Connected to SQL Database');
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});

app.use(
  "/graphql",
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = await protect(req);
      return auth
    },
  })
);


