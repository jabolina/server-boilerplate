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

test("Register-user", async () => {
    const registerUserMutation = `
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

    // Insert new user in database
    const happyRegisterResponse = await request(GRAPHQL_HOST, registerUserMutation);
    expect(happyRegisterResponse).toEqual({ register: { success: true, code: 1, error: null } });

    const sadRegisterResponse = await request(GRAPHQL_HOST, registerUserMutation);
    expect(sadRegisterResponse).toMatchObject({ register: { success: false, code: 1, error: [{}]}});

    // Query user with email
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    // Found user is the same inserted user
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.firstName).toEqual(firstName);
});


afterAll(async () => {
    await closeGlobalDatabaseConnection();
});
