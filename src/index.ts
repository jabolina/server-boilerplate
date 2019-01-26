import "dotenv/config";
import { Router } from "express";
import { GraphQLSchema } from "graphql";
import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { create } from "./graphql";
import { sessionMiddleware } from "./middleware/session";
import { redis } from "./redis";
import { routes } from "./routes/user";
import { createDabataseConnection } from "./utils/typeorm";




(async () => {
    const schema: GraphQLSchema = create();
    const server: GraphQLServer = new GraphQLServer({
        schema,
        context: ({ request }: any) => ({
            redis,
            url: `${request.protocol}://${request.get("host")}`,
            session: request.session,
            request,
        }),
    });

    server.express.use(sessionMiddleware());

    const router: Router = routes(redis);
    server.express.use("/", router);

    await createDabataseConnection();
    await server.start({
        cors: {
            credentials: true,
            origin: "http://localhost:3000",
        }
    });

    console.log("Server listening on port 4000");
})();
