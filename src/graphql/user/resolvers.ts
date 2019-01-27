import * as bcrypt from "bcryptjs";
import * as yup from "yup";
import { REDIS_FORGOT_PASSWORD_PREFIX, REDIS_USER_SESSION_PREFIX, DISABLE_ACCOUNT_CODE, CHANGE_PASSWORD_CODE, LOGIN_CODE, REGISTER_CODE } from "../../constants";
import { User } from "../../entity/User";
import { statusMessage } from "../../i18n";
import { sendEmailSMTP } from "../../service/email";
import { accountChangesEmailTemplate, accountChangesSubject, verifyEmailSubject, verifyEmailTemplate } from "../../service/email/template";
import { lockAccount, removeAllSessions } from "../../service/user";
import { GraphQLResolver } from "../../types/graphqlUtils";
import { parseValidationError } from "../../utils/error";
import { createConfirmationLink, createForgotPasswordLink } from "../../utils/linkFactory";
import { createGraphQLMiddleware } from "../../middleware";
import graphql from "../../middleware/graphql";

const passwordField: yup.StringSchema = yup.string().min(5).max(255);
const registerSchema = yup.object().shape({
    firstName: yup.string().min(4).max(30),
    email: yup.string().max(255).email(),
    password: passwordField,
});

export const resolvers: GraphQLResolver = {
    Query: {
        dummy: () => "yep",
    },
    Mutation: {
        register: async (_, args: GQL.IRegisterOnMutationArguments, { url, redis }) => {
            try {
                await registerSchema.validate(args, { abortEarly: false });
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
                    // TODO: use this with the frontend URL, to the email confirmed route
                    const link: string = await createConfirmationLink(url, dbUser.id, redis);
                    await sendEmailSMTP(dbUser.email, verifyEmailSubject(dbUser.firstName), verifyEmailTemplate(link, dbUser.firstName));
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

            if (!isPasswordValid || !user.confirmed || user.disabled) {
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
                await removeAllSessions(userId, redis);
                return true;
            }

            return false;
        },
        sendForgotPasswordEmail: async (_, { email }: GQL.ISendForgotPasswordEmailOnMutationArguments, { url, redis }) => {
            const user: User | undefined = await User.findOne({ where: { email }});

            if (!user || !user.confirmed) {
                return false;
            }

            // TODO: use this with the frontend URL, to the change password route
            const link: string = await createForgotPasswordLink(url, user.id, redis);
            await lockAccount(user.id, redis);
            await sendEmailSMTP(email, accountChangesSubject(user.firstName), accountChangesEmailTemplate(link, user.firstName));

            return true;
        },
        changePassword: async (_, { newPassword, key }: GQL.IChangePasswordOnMutationArguments, { redis }) => {
            const errorResponse = {
                success: false,
                code: CHANGE_PASSWORD_CODE,
                error: [{
                    path: "reset",
                    message: statusMessage("en", CHANGE_PASSWORD_CODE, false),
                }],
            };

            try {
                await passwordField.validate(newPassword, { abortEarly: false });
            } catch (err) {
                return {
                    success: false,
                    code: CHANGE_PASSWORD_CODE,
                    error: parseValidationError(err.inner),
                };
            }

            const userId: string | null = await redis.get(`${REDIS_FORGOT_PASSWORD_PREFIX}${key}`);

            if (!userId) {
                return errorResponse;
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);
            const updatePromise: Promise<any> = User.update({ id: userId }, { password: hashedPassword, disabled: false });
            const deleteKeyPromise: Promise<any> = redis.del(`${REDIS_FORGOT_PASSWORD_PREFIX}${key}`);

            await Promise.all([updatePromise, deleteKeyPromise]);

            return {
                success: true,
                code: CHANGE_PASSWORD_CODE,
            };
        },
        disableAccount: createGraphQLMiddleware(graphql,
            async (_, __, { redis, userId }) => {
                const user: User | undefined = await User.findOne({ where: { id: userId }});

                if (!user) {
                    return {
                        success: false,
                        code: DISABLE_ACCOUNT_CODE,
                        error: [{
                            path: "disable",
                            message: statusMessage("en", DISABLE_ACCOUNT_CODE, false),
                        }],
                    };
                }

                await lockAccount(user.id, redis);

                return {
                    success: true,
                    code: DISABLE_ACCOUNT_CODE,
                };
        }),
    },
};
