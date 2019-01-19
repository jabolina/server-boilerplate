import "reflect-metadata";

import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";

import { resolvers } from "./graphql/resolvers";

const typeDefs = importSchema("./src/graphql/schema.graphql");

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
    console.log("Server listening on port 4000");
});
