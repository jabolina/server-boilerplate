import { GraphQLResolver } from "../../types/graphql-utils";

export const resolvers: GraphQLResolver = {
    Query: {
        hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Bye ${name || "World"}`,
    },
};