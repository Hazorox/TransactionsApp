import { ApolloServer } from "@apollo/server";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import passport from "passport";

import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import {passportConfig} from './passport/passport.config.js';
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";
dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const mongoDBStore = ConnectMongoDBSession(session);
const store = new mongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", (error) => console.log(error));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  "/",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:4000/`);
