import * as bcrypt from "bcryptjs";
import { GraphQLResolver } from "../../types/graphql-utils";
import { User } from "../../entity/User";

export const resolvers: GraphQLResolver = {
    Query: {
        bye: () => {
            return "Bye";
        },
    },
    Mutation: {
        register: async (_, { firstName, email, password }: GQL.IRegisterOnMutationArguments) => {
            const hashedPassword = await bcrypt.hash(password, 12);
            const dbUser = User.create({
                firstName,
                email,
                password: hashedPassword,
            });

            await dbUser.save();

            return true;
        },
    },
};
