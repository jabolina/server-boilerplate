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

                await dbUser.save();

                if (process.env.NODE_ENV !== "test") {
                    const link: string = await createConfirmationLink(url, dbUser.id, redis);
                    await sendEmailSMTP(dbUser.email, link, dbUser.firstName);
                }

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
                        message: statusMessage("en", REGISTER_CODE, false),
                    }],
                };
            }
        },
        login: async (_, { email, password }: GQL.ILoginOnMutationArguments) => {
            const LOGIN_CODE = 2;
            const errorMessage: any = {
                success: false,
                code: 2,
                error: [{
                    path: "login",
                    message: statusMessage("en", LOGIN_CODE, false),
                }],
            };
            const user: User | undefined = await User.findOne({ where: { email } });

            if (!user) {
                return errorMessage;
            }

            const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

            if (!isPasswordValid || !user.confirmed) {
                return errorMessage;
            }

            return {
                success: true,
                code: LOGIN_CODE,
            };
        },
    },
};
