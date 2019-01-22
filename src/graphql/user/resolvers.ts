import * as bcrypt from "bcryptjs";
import * as yup from "yup";
import { GraphQLResolver } from "../../types/graphqlUtils";
import { User } from "../../entity/User";
import { parseValidationError } from "../../utils/error";
import { statusMessage } from "../../i18n";
import { sendEmailSMTP } from "../../service/email";
import { createConfirmationLink } from "../../utils/registerConfirmation";

const schema = yup.object().shape({
    firstName: yup.string().min(4).max(30),
    email: yup.string().max(255).email(),
    password: yup.string().min(5).max(255),
});

export const resolvers: GraphQLResolver = {
    Query: {
        bye: () => {
            return "Bye";
        },
    },
    Mutation: {
        register: async (_, args: GQL.IRegisterOnMutationArguments, { url, redis }) => {
            const REGISTER_CODE: any = 1;

            try {
                await schema.validate(args, { abortEarly: false });
            } catch (err) {
                return {
                    success: false,
                    code: REGISTER_CODE,
                    error: parseValidationError(err.inner),
                };
            }

            try {
                const { firstName, email, password } = args;
                const hashedPassword = await bcrypt.hash(password, 12);
                const dbUser = User.create({
                    firstName,
                    email,
                    password: hashedPassword,
                });

                if (process.env.NODE_ENV !== "test") {
                    const link: string = await createConfirmationLink(url, dbUser.id, redis);
                    console.log(link);
                    await sendEmailSMTP(dbUser.email, link, dbUser.firstName);
                }

                await dbUser.save();

                return {
                    success: true,
                    code: REGISTER_CODE,
                };
            } catch (err) {
                console.log(err);
                return {
                    success: false,
                    code: REGISTER_CODE,
                    error: [{
                        path: "register",
                        message: statusMessage("en", REGISTER_CODE, false),
                    }],
                };
            }
        },
    },
};
