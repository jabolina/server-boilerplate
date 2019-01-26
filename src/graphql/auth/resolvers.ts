import { GraphQLResolver } from "../../types/graphqlUtils";
import { User } from "../../entity/User";
import { createGraphQLMiddleware } from "../../middleware";
import graphql from "../../middleware/graphql";

export const resolvers: GraphQLResolver = {
    Query: {
        me: createGraphQLMiddleware(graphql, async (_, __, { session }) => User.findOne({ where: { id: session.userId }})),
    },
};
