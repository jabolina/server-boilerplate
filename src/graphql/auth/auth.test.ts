import { Connection } from "typeorm";
import { createDabataseConnection } from "../../utils/typeorm";
import { User } from "../../entity/User";
import axios from "axios";
import * as bcrypt from "bcryptjs";

let conn: Connection;
let userId: string;

const GRAPHQL_HOST = "http://localhost:4000";
const firstName: string = "test user";
const email: string = "test-auth@test.com";
const password: string = "testpass";


const createGlobalDatabaseConnection = () => new Promise((resolve) => createDabataseConnection().then((conn: Connection) => resolve(conn)));

beforeAll(async () => {
    conn = await createGlobalDatabaseConnection() as Connection;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user: User = await User.create({
        firstName,
        email,
        password: hashedPassword,
        confirmed: true,
    }).save();

    userId = user.id;
});

const closeGlobalDatabaseConnection = async () => {
    await conn.close();
};

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

const meQuery: string = `
  query {
    me {
      id
      email
    }
  }
`;

describe("authentication-tests", async () => {
    test("retrieve-me-no-session", async () => {
        const authResponse: any = await axios.post(GRAPHQL_HOST, {
            query: meQuery,
        });

        expect(authResponse.data.data.me).toBeNull();
    });

    test.skip("retrieve-me-success", async () => {
        /**
         * Skipping this test because axios doesnt make request with credentials, always causing test to fail
         */
        axios.defaults.withCredentials = true;
        await axios.post(GRAPHQL_HOST, {
            query: loginMutation(email, password),
        }, {
                withCredentials: true,
            });

        const authResponse: any = await axios.post(GRAPHQL_HOST, {
            query: meQuery,
        }, {
                withCredentials: true,
            });

        expect(authResponse.data.data).toEqual({ me: { id: userId, email } });
    });
});

afterAll(async () => {
    await closeGlobalDatabaseConnection();
});
