import { Redis } from "ioredis";

export interface Session {
    userId?: string;
}

export type GraphQLContext = {
    url: string,
    redis: Redis,
    session: Session,
};

export type Resolver = (parent: any, args: any, context: GraphQLContext, info: any) => any;

export type GraphQLMiddleware = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: GraphQLContext,
    info: any
) => any;

export interface GraphQLResolver {
    [key: string]: {
        [key: string]: Resolver
    }
};
