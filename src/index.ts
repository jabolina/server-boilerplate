import "reflect-metadata";

import { GraphQLServer } from "graphql-yoga";

import { create } from "./graphql";
import { createDabataseConnection } from "./utils/typeorm";
import { GraphQLSchema } from "graphql";

(async () => {
    const schema: GraphQLSchema = create();
    const server: GraphQLServer = new GraphQLServer({ schema });
    await createDabataseConnection();
    await server.start();

    console.log("Server listening on port 4000");
})();
