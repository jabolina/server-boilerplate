import * as bcrypt from "bcryptjs";
import { GraphQLResolver } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import { statusMessage } from "../../i18n";

export const resolvers: GraphQLResolver = {
    Query: {
        bye: () => {
            return "Bye";
        },
    },
    Mutation: {
        register: async (_, { firstName, email, password }: GQL.IRegisterOnMutationArguments) => {
            const REGISTER_CODE: any = 1;
            try {
                const hashedPassword = await bcrypt.hash(password, 12);
                const dbUser = User.create({
                    firstName,
                    email,
                    password: hashedPassword,
                });

                await dbUser.save();

                return {
                    success: true,
                    code: REGISTER_CODE,
                };
            } catch (err) {
                return {
                    success: false,
                    code: REGISTER_CODE,
                    error: [{
                        path: "register",
                        message: statusMessage("pt", REGISTER_CODE, false),
                    }],
                };
            }
        },
    },
};
