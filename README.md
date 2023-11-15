# RealWorld Express

This codebase is my collection of implementations following the [RealWorld](https://github.com/gothinkster/realworld) specifications and APIs. It primarily uses Express.js as the backend and incorporates frontend technologies such as Vue.js, React.js, Nuxt.js, and Next.js, along with databases such as PostgreSQL and MongoDB. The main reasons for creating these repositories are:
- To learn the implementation of a single project with various technologies for both frontend and backend.
- To gain knowledge in various backend technologies, primarily Express.js.
- To explore various frontend technologies.
- To understand different databases, such as PostgreSQL and MongoDB.
- To learn how to interact with databases using ORMs like Prisma or by using raw queries.
- To create standardized testing for both backend and frontend, which will serve as a specification for the application.

 ## Project
 This repository is structured using Turborepo. You can find various projects inside the `apps` folder and utilities inside the `package` folder.
 
 ## Technology Stack
- Frontend → Vue.js, React.js Next.js Nuxt.js
- Backend → Express.js
- Database → PostgreSQL, MongoDB
- Testing → Vitest, Supertest, Cypress
- Turborepo
- OpenAPI
- Docker (TODO)

## Folder Structure
- apps
    - client-react → (TODO)
    - client-next (TODO)
    - client-vue (TODO)
    - client-nuxt (TODO)
    - server-express-mongodb (TODO)
    - server-express-prisma → Backend project using Express, Prisma, PosgreQL
    - server-express-prisma-relation → Backend project using Express, Prisma, PosgreQL
    - server-express-raw-query (TODO)
    - server-express-relation-raw-query (TODO)
- package
    - validator → Types, Validator, Viewer for backend
    - test-express → Backend testing using Vite and Supertest
    - test-client (TODO)
    - ui-react (TODO)
    - ui-vue (TODO)
- specs →  OpenAPI specification for this project
