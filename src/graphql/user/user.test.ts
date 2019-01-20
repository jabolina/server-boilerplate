import { request } from "graphql-request";

import { createDabataseConnection } from "../../utils/typeorm";
import { User } from "../../entity/User";
import { Connection } from "typeorm";

const GRAPHQL_HOST = "http://localhost:4000";
const firstName = "register-user-test";
const email = "register@test.com";
const password = "test-register";
let conn: Connection;

const createGlobalDatabaseConnection = (fn: Function) => createDabataseConnection().then((conn: Connection) => fn(conn));

createGlobalDatabaseConnection((connection: Connection) => {
    conn = connection;
});

const closeGlobalDatabaseConnection = async () => {
    await conn.close();
}

const registerMutation = (firstName: string, email: string, password: string) => `
    mutation {
        register(firstName: "${firstName}", email:"${email}", password: "${password}") {
            success
            code
            error {
            path
            message
            }
        }
    }
`;

test("register-user-success", async () => {
    // Insert new user in database
    const happyRegisterResponse = await request(GRAPHQL_HOST, registerMutation(firstName, email, password));
    expect(happyRegisterResponse).toEqual({ register: { success: true, code: 1, error: null } });

    // Query user with email
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    // Found user is the same inserted user
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.firstName).toEqual(firstName);
});

test("register-user-duplicate-email", async () => {
    // Insert user with duplicate email
    const sadRegisterResponse = await request(GRAPHQL_HOST, registerMutation(firstName, email, password));
    expect(sadRegisterResponse).toMatchObject({ register: { success: false, code: 1, error: [{}] } });
});

test("register-malformed-user-email", async () => {
    const malformedEmail = email.substr(0, 4);

    // Insert malformed email
    const malformedEmailRegisterResponse: any = await request(GRAPHQL_HOST, registerMutation(firstName, malformedEmail, password));
    expect(malformedEmailRegisterResponse).toMatchObject({ register: { success: false, code: 1, error: [{}] } });

    const { register } = malformedEmailRegisterResponse;
    expect(register.error).toHaveLength(1);
});

test("register-malformed-user-password", async () => {
    const malformedPassword = password.substr(0, 4);

    // Insert malformed password
    const malformedPasswordRegisterResponse: any = await request(GRAPHQL_HOST, registerMutation(firstName, email, malformedPassword));
    expect(malformedPasswordRegisterResponse).toMatchObject({ register: { success: false, code: 1, error: [{}] } });

    const { register } = malformedPasswordRegisterResponse;
    expect(register.error).toHaveLength(1);
});

test("register-malformed-user-password-and-email", async () => {
    const malformedPassword = password.substr(0, 4);
    const malformedEmail = email.substr(0, 4);

    // Insert malformed password
    const malformedUserRegisterResponse: any = await request(GRAPHQL_HOST, registerMutation(firstName, malformedEmail, malformedPassword));
    expect(malformedUserRegisterResponse).toMatchObject({ register: { success: false, code: 1, error: [{}, {}] } });

    const { register } = malformedUserRegisterResponse;
    expect(register.error).toHaveLength(2);
});

afterAll(async () => {
    await closeGlobalDatabaseConnection();
});
