import * as fs from "fs";
import * as path from "path";
import { importSchema } from "graphql-import";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";

export const create = () => {
    const schemas: GraphQLSchema[] = [];
    const folders = fs.readdirSync(path.join(__dirname));

    folders.forEach((name) => {
        if (!/[a-z]+\.ts/.test(name)) {
            const { resolvers } = require(`./${name}/resolvers`);
            const typeDefs: string = importSchema(path.join(__dirname) + `/${name}/schema.graphql`);
            
            schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
        }
    });

    return mergeSchemas({ schemas });
};
