// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
hello: string;
bye: string | null;
}

interface IHelloOnQueryArguments {
name?: string | null;
}

interface IMutation {
__typename: "Mutation";
register: IRegisterResponse;
}

interface IRegisterOnMutationArguments {
firstName: string;
email: string;
password: string;
}

interface IRegisterResponse {
__typename: "RegisterResponse";
success: boolean;
error: Array<IError> | null;
code: number;
}

interface IError {
__typename: "Error";
path: string;
message: string;
}
}

// tslint:enable
