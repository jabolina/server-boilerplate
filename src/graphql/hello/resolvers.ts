import { GraphQLResolver } from "../../types/graphqlUtils";

export const resolvers: GraphQLResolver = {
    Query: {
        hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Bye ${name || "World"}`,
    },
};