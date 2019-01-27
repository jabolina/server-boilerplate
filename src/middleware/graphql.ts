import { Resolver } from "../types/graphqlUtils";

/**
 * Here you can manipulate the user session, verify roles and stuff like that
 */
export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any) => {

        if (context.session && context.session.sessionId) {
            const userId: string = await context.redis.get(context.session.sessionId);
            context.userId = userId;
        }

        return await resolver(parent, args, context, info);
    }
