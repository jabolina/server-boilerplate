import { Redis } from "ioredis";
import { Request } from "express";

export interface Session extends Express.Session {
    userId?: string;
}

export interface GraphQLContext {
    url: string,
    redis: Redis,
    session: Session,
    request: Request,
    userId?: string;
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
