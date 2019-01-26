import { request } from "graphql-request";

import { createDabataseConnection } from "../../utils/typeorm";
import { User } from "../../entity/User";
import { Connection } from "typeorm";
import { createConfirmationLink } from "../../utils/registerConfirmation";
import { redis } from "../../redis";

const GRAPHQL_HOST = "http://localhost:4000";

const firstName = "register-user-test";
const firstName2 = "register-user-test2";

const email = "register@test.com";
const email2 = "another_register@test.com";

const password = "test-register";
const password2 = "test-register";

let conn: Connection;
let userId: string;

const createGlobalDatabaseConnection = (fn: Function) => createDabataseConnection().then((conn: Connection) => fn(conn));

createGlobalDatabaseConnection((connection: Connection) => {
    conn = connection;
});

const closeGlobalDatabaseConnection = async () => {
    await conn.close();
}

const registerMutation = (f: string, e: string, p: string) => `
    mutation {
        register(firstName: "${f}", email:"${e}", password: "${p}") {
            success
            code
            error {
                path
                message
            }
        }
    }
`;

const loginMutation = (e: string, p: string) => `
    mutation {
    login(email: "${e}", password: "${p}") {
      success
      code
      error {
        path
        message
      }
    }
  }
`;

describe("user-register-tests", async () => {
    test("register-user-success", async () => {
        // Insert new user in database
        // Will insert 2 to use one to confirm email and to login
        const happyRegisterResponse: any = await request(GRAPHQL_HOST, registerMutation(firstName, email, password));
        const happyRegisterResponse2: any = await request(GRAPHQL_HOST, registerMutation(firstName2, email2, password2));
        expect(happyRegisterResponse).toEqual({ register: { success: true, code: 1, error: null } });
        expect(happyRegisterResponse2).toEqual({ register: { success: true, code: 1, error: null } });
    
        // Query user with email
        const users = await User.find({ where: { email } });
        expect(users).toHaveLength(1);
    
        // Found user is the same inserted user
        const user = users[0];
        userId = user.id;
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
});

describe("user-confirmation-link", async () => {
    test("create-link-then-click", async () => {
        const link = await createConfirmationLink(
            GRAPHQL_HOST,
            userId as string,
            redis,
        );

        const response: any = await fetch(link);
        const text: string = (await response.text());
        expect(text).toEqual("ok");

        const user: User = await User.findOne({ where: { id: userId } }) as User;
        expect(user.confirmed).toBeTruthy();

        const wrongResponse: any = await fetch(link);
        const wrongText: string = (await wrongResponse.text());
        expect(wrongText).toEqual("nop");
    });
});

describe("user-login", async () => {
    test("login-malformed-email", async () => {
        const malformedEmail = email2 + ".wrong.email";

        // Login with wrong email
        const malformedEmailLoginResponse: any = await request(GRAPHQL_HOST, loginMutation(malformedEmail, password2));
        expect(malformedEmailLoginResponse).toMatchObject({ login: { success: false, code: 2, error: [{}] }});
    });

    test("login-email-not-confirmed", async () => {
        // Login with an non confirmed email
        const notConfirmedLoginResponse: any = await request(GRAPHQL_HOST, loginMutation(email2, password2));
        expect(notConfirmedLoginResponse).toMatchObject({ login: { success: false, code: 2, error: [{}] }});

        // Confirm email for further tests
        await User.update({ email: email2 }, { confirmed: true });
    });

    test("login-malformed-password", async () => {
        const malformedPassword = password2 + "wrong-password";

        // Login with wrong email
        const malformedPasswordLoginResponse: any = await request(GRAPHQL_HOST, loginMutation(email2, malformedPassword));
        expect(malformedPasswordLoginResponse).toMatchObject({ login: { success: false, code: 2, error: [{}] }});
    });

    test("login-successfully", async () => {
        const loginSuccessResponse: any = await request(GRAPHQL_HOST, loginMutation(email2, password2));
        expect(loginSuccessResponse).toEqual({ login: { success: true, code: 2, error: null }});
    });
});

afterAll(async () => {
    await closeGlobalDatabaseConnection();
    await redis.disconnect();
});
