import { v4 } from "uuid";
import { Redis } from "ioredis";
import { REDIS_FORGOT_PASSWORD_PREFIX } from "../constants";

export const createConfirmationLink = async (url: string, userId: string, redis: Redis) => {
    const id = v4();
    await redis.set(id, userId, "ex", 60 * 60 * 24 * 7);
    return `${url}/confirm/${id}`;
};

export const createForgotPasswordLink = async (url: string, userId: string, redis: Redis) => {
    const id: string = v4();
    await redis.set(`${REDIS_FORGOT_PASSWORD_PREFIX}${id}`, userId, "ex", 60 * 20);
    return `${url}/change-password/${id}`;
}
