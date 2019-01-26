import { Resolver, GraphQLMiddleware } from "../types/graphqlUtils";

export const createGraphQLMiddleware = (middlewareFn: GraphQLMiddleware, resolverFn: Resolver) => (
    parent: any,
    args: any,
    context: any,
    info: any,
) => middlewareFn(resolverFn, parent, args, context, info);