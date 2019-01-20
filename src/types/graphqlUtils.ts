import { Redis } from "ioredis";

export interface GraphQLResolver {
    [key: string]: {
        [key: string]: (parent: any, args: any, context: { url: string, redis: Redis }, info: any) => any
    }
};
