import "reflect-metadata";

import { GraphQLServer } from "graphql-yoga";

import { create } from "./graphql";
import { createDabataseConnection } from "./utils/typeorm";
import { GraphQLSchema } from "graphql";
import * as Redis from "ioredis";
import { Request, Response } from "express";
import { User } from "./entity/User";

const confirmationRoute = (server: GraphQLServer, redis: Redis.Redis) => {
    server.express.get("/confirm/:id", async (req: Request, res: Response) => {
        console.log("Received link confirmation");
        const { id } = req.params;
        const userId: string | null = await redis.get(id);

        if (userId) {
            await User.update({ id: userId }, { confirmed: true });
            res.send("ok");
        } else {
            res.send("nop");
        }
    });
}

(async () => {
    const redis = new Redis();
    const schema: GraphQLSchema = create();
    const server: GraphQLServer = new GraphQLServer({
        schema,
        context: ({ request }: any) => ({
            redis,
            url: `${request.protocol}://${request.get("host")}`,
        })
    });
    await createDabataseConnection();
    await server.start();
    confirmationRoute(server, redis);

    console.log("Server listening on port 4000");
})();
