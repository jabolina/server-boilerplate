import { GraphQLResolver } from "../types/graphql-utils";

export const resolvers: GraphQLResolver = {
    Query: {
        hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Bye ${name || "World"}`,
    },
    Mutation: {
        register: (_, { name, email, password }: GQL.IRegisterOnMutationArguments) => {
            console.log(name);
            console.log(email);
            console.log(password);
        },
    },
};