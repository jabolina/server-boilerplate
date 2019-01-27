# Server boilerplate
---

This is a TypeScript server boilerplate to be used in some projects. It's currently using
a MySQL database and the TypeORM to manage data, for requests is using GraphQL and Express
as well.

There is only one entity in this boilerplate, the User entity, with parameters
firstName, email, password, and some other booleans for control. With this implementation
you can register, login, change password and disable account.

When a new user is registered, and email is sent to the registered email to verify
the account, the email is sent using or and SMTP client or a private email sender,
SparkPost, in this case.

With the verified email, the user can now login, can forgot password and disable account.
When the user forgot his password, an email is sent, with a verification link that lasts
for 20 minutes, where the user can access a frontend page to insert the new password(remember,
there is no frontend here).

Some of the management, like link expiration and email confirmation, is dealt with Redis.

There is protected routes using the GraphQL, where is built a middleware, where can also
verify user roles, if needed. Disable account, for example, uses this middleware for
example purposes.

Acount enabling was not implemented, because the developer can choose differents ways for
enabling an account again, using email or some other stuff.

There is only a few tests in here, the tests files remains with the resolvers files. The tests
were made using Jest.

There is a rate limiter, if an IP sends 250 request in 5 minutes inteval, he will be blocked
for some time. As an TODO, can create a rate limiter for a login with the same email.

The application will run on port 4000 and the GraphQL playground will be on ```localhost:4000/```.

## TLDR
---
This boilerplate have:

    * User entity using TypeORM and MySQL
    * Register
    * Email verification
    * Login
    * Forgot password
    * Disable account
    * Internationalization for error messages, just for fun heheh

Is currently using:

    * TypeORM as ORM
    * MySQL as database
    * GraphQL Yoga, with GraphQL and Express
    * Redis for some data and session management
