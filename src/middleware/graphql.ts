import { Resolver } from "../types/graphqlUtils";

export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any) => {

        const result: any = await resolver(parent, args, context, info);
        return result;
};
