import "reflect-metadata";

import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import { join } from "path";

import { resolvers } from "./graphql/resolvers";
import { createConnection } from "typeorm";

const typeDefs = importSchema(join(__dirname + "/graphql/schema.graphql"));

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
    server.start(() => {
        console.log("Server listening on port 4000");
    });
});
