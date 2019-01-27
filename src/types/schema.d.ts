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
    __typename: 'Query';
    me: IUser | null;
    dummy: string | null;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    email: string;
  }

  interface IMutation {
    __typename: 'Mutation';
    register: IRegisterResponse;
    login: ILoginResponse;
    logout: boolean;
    sendForgotPasswordEmail: boolean;
    changePassword: IChangePasswordResponse;
    disableAccount: IDisableAccountResponse;
  }

  interface IRegisterOnMutationArguments {
    firstName: string;
    email: string;
    password: string;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface ISendForgotPasswordEmailOnMutationArguments {
    email: string;
  }

  interface IChangePasswordOnMutationArguments {
    newPassword: string;
    key: string;
  }

  interface IDisableAccountOnMutationArguments {
    userId: string;
  }

  interface IRegisterResponse {
    __typename: 'RegisterResponse';
    success: boolean;
    error: Array<IError> | null;
    code: number;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }

  interface ILoginResponse {
    __typename: 'LoginResponse';
    success: boolean;
    error: Array<IError> | null;
    code: number;
  }

  interface IChangePasswordResponse {
    __typename: 'ChangePasswordResponse';
    success: boolean;
    code: number;
    error: Array<IError> | null;
  }

  interface IDisableAccountResponse {
    __typename: 'DisableAccountResponse';
    success: boolean;
    code: number;
    error: Array<IError> | null;
  }
}

// tslint:enable
