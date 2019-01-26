import * as session from "express-session";
import * as connectRedis from "connect-redis";

export const sessionMiddleware = () => {
    const RedisStore: connectRedis.RedisStore = connectRedis(session);
    return session({
        name: "qid",
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({}),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    });
}
