# RealWorld Example App

> ### Typescript + Express + Prisma codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://realworld.seuronao.duckdns.org)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a backend built with **Typescript + Express + node-postgres** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Typescript** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

The project is build using [TypeScript](https://www.typescriptlang.org/) for language, [Express](https://expressjs.com/) for routing and server framework and [node-postgres](https://github.com/brianc/node-postgres).

The project uses [PostgreSQL](https://www.postgresql.org/) for the database.

For unit testing it uses the [Jest](https://jestjs.io/) framework since.

# Getting started

To run this project you should have _node/npm_ installed.

Run `npm install` to install the dependencies.

Create a development environment file `.env` inside the root folder with the following attributes:

```
POSTGRES_URL="postgresql://postgres:postgres@127.0.0.1:5432/db?pgbouncer=true&connect_timeout=15"
JWT_SECRET=theSecretForCreatingTheJWT
```

- To run the development version `npm run develop`.
- To test the application `npm test`.
- To build a production version `npm run build`.
- To run the production build `npm run start`.