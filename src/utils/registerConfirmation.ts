import { v4 } from "uuid";
import { Redis } from "ioredis";

export const createConfirmationLink = async (url: string, userId: string, redis: Redis) => {
    const id = v4();
    await redis.set(id, userId, "ex", 86400);
    return `${url}/confirm/${id}`;
};
