import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import pkg from "body-parser";
const { json } = pkg;

import schema from "./schema/index.js";
import prisma from "./client.js";
import resolvers from './resolvers/index.js';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);


