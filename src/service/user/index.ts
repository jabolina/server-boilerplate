import { Redis } from "ioredis";
import { REDIS_USER_SESSION_PREFIX, REDIS_SESSION_PREFIX } from "../../constants";
import { User } from "../../entity/User";

export const removeAllSessions = async (userId: string, redis: Redis) => {
    const allSessionIds: any[] = await redis.lrange(`${REDIS_USER_SESSION_PREFIX}${userId}`, 0, -1);            
    allSessionIds.forEach(async (sessionId) => await redis.del(`${REDIS_SESSION_PREFIX}${sessionId}`)); 
};

export const lockAccount = async (userId: string, redis: Redis) => {
    await User.update({ id: userId }, { disabled: true });
    await removeAllSessions(userId, redis);
};
