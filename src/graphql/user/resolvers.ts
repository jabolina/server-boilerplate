import * as bcrypt from "bcryptjs";
import * as yup from "yup";
import { User } from "../../entity/User";
import { statusMessage } from "../../i18n";
import { sendEmailSMTP } from "../../service/email";
import { GraphQLResolver } from "../../types/graphqlUtils";
import { parseValidationError } from "../../utils/error";
import { createConfirmationLink } from "../../utils/registerConfirmation";
import { REDIS_USER_SESSION_PREFIX, REDIS_SESSION_PREFIX } from "../../constants";

const schema = yup.object().shape({
    firstName: yup.string().min(4).max(30),
    email: yup.string().max(255).email(),
    password: yup.string().min(5).max(255),
});

export const resolvers: GraphQLResolver = {
    Query: {
        dummy: () => "yep",
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
        login: async (_, { email, password }: GQL.ILoginOnMutationArguments, { session, redis, request }) => {
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

            session.userId = user.id;

            if (request.sessionID) {
                await redis.lpush(`${REDIS_USER_SESSION_PREFIX}${user.id}`, request.sessionID);
            }

            return {
                success: true,
                code: LOGIN_CODE,
            };
        },
        logout: async (_, __, { session, redis }) => {
            const { userId } = session;

            if (userId) {
                const allSessionIds: any[] = await redis.lrange(`${REDIS_USER_SESSION_PREFIX}${userId}`, 0, -1);
                
                allSessionIds.forEach(async (sessionId) => await redis.del(`${REDIS_SESSION_PREFIX}${sessionId}`));
                return true;
            }

            return false;
        },
    },
};
