import "reflect-metadata";

import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import { join } from "path";

import { resolvers } from "./graphql/resolvers";
import { createDabataseConnection } from "./utils/typeorm";

const typeDefs = importSchema(join(__dirname + "/graphql/schema.graphql"));

(async () => {
    const server = new GraphQLServer({ typeDefs, resolvers });
    await createDabataseConnection();
    await server.start();

    console.log("Server listening on port 4000");
})();
