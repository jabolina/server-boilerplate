import { Router, Request, Response } from "express";
import { Redis } from "ioredis";
import { User } from "../entity/User";

const router: Router = Router();

export const routes = (redis: Redis) => {
    router.get("/confirm/:id", async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId: string | null = await redis.get(id);

        console.log(`Received link confirmation with id: [${id}]`);

        if (userId) {
            await User.update({ id: userId }, { confirmed: true });
            await redis.del(id);
            res.send("ok");
        } else {
            res.send("nop");
        }
    });

    return router;
}
