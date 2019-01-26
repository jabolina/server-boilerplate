import { Redis } from "ioredis";

export interface Session {
    userId?: string;
}

export interface GraphQLResolver {
    [key: string]: {
        [key: string]: (parent: any, args: any, context: {
            url: string,
            redis: Redis,
            session: Session,
        }, info: any) => any
    }
};
