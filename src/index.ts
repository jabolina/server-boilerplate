import "reflect-metadata";

import { GraphQLServer } from "graphql-yoga";

import { create } from "./graphql";
import { createDabataseConnection } from "./utils/typeorm";
import { GraphQLSchema } from "graphql";

import { routes } from "./routes/user";
import { Router } from "express";
import { redis } from "./redis";

(async () => {
    const schema: GraphQLSchema = create();
    const server: GraphQLServer = new GraphQLServer({
        schema,
        context: ({ request }: any) => ({
            redis,
            url: `${request.protocol}://${request.get("host")}`,
        })
    });

    const router: Router = routes(redis);
    server.express.use("/", router);
    await createDabataseConnection();
    await server.start();

    console.log("Server listening on port 4000");
})();
