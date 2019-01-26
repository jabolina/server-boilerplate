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
        if (!context.session || !context.session.userId) {
            return null;
        }
        
        const result: any = await resolver(parent, args, context, info);
        return result;
};
