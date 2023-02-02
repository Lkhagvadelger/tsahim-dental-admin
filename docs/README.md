# Elearn

> Improving global health equity by making medical expertise available to all

This repository contains the entire codebase for the elearn application.

## 👉 Get Started

This repository is a Nextjs monoapp.

- **/pages/** contains the entrypoint to the web ui and apis. We recommend keeping things here as light-weight as possible, with all the heavy lifting being done by libraries that are imported by each route.

- **/lib/** contains the library projects. There are many different kinds of libraries, and each library defines its own external API so that boundaries between libraries remain clear.

- **/docs/** codebase architecture and feature development documentation

## 💻 Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) - LTS version recommended
- [Docker](https://www.docker.com/get-started) - [Compose](https://docs.docker.com/compose/) to run multi containers locally
- `.env.local` file - You can get a copy of this file from another team member.

We leverage [Docker Compose](https://docs.docker.com/compose/overview/) to manage db/3p API containers for each project.

### Local Development

```sh
# Installing dependencies
npm install

# Start a docker container containing your local database
npm run docker-compose up -d
# If you run into `invalid mount config for type "bind": bind source path does not exist: /db` error, you need to create a db folder - `mkdir db`

# Run db migrations
npm run prisma:migrate:dev

# Seed your database
npm run db:seed

# To start the app
npm run dev
```

This will start the [Next.js](https://nextjs.org/) development server. When the above command completes you'll be able to view your website at `http://localhost:3000`

## 🥞 Stack

This project uses the following libraries and services:

- Web Frontend - [Next.js](https://nextjs.org)
- Styles - [Chakra UI with custom styles](https://chakra-ui.com/)

- Server Api - [Next.js API routes](https://nextjs.org/docs/api-routes/introduction) + [Next-connect](https://github.com/hoangvvo/next-connect)
- Database ORM - [Prisma](https://www.prisma.io/)
- Database - [PostgreSQL](https://www.postgresql.org/)

- Testing - [Jest](https://jestjs.io/)
- Deployment - [Heroku](https://www.heroku.com/)

## 📚 Documentation

For further documentation you can refer to the [`/docs`](/docs) directory.

# Docs

I recommend skimming these docs in order once to get a feel for how everything fits together. It shouldn't take more than a couple minutes!

1. [Overview](./1-overview.md)
1. [Architecture](./2-architecture.md)
1. [Authentication/Authorization](./3-auth.md)
1. [Building a feature](./4-feature.md)
1. [Testing](./5-testing.md)
1. [Production](./6-production.md)
