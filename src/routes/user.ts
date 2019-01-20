import { Router, Request, Response } from "express";
import { Redis } from "ioredis";
import { User } from "../entity/User";

const router: Router = Router();

export const routes = (redis: Redis) => {
    router.get("/confirm/:id", async (req: Request, res: Response) => {
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

    return router;
}
