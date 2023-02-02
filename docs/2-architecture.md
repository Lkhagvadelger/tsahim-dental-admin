# Architecture

The tools you will interact with most frequently are:

1. **[Next.js](https://nextjs.org)** as the base web framework to render pages with React
1. **[Prisma](https://prisma.io)** as the ORM to manage the database and migrations
1. **[Chakra UI with custom styles](https://chakra-ui.com/)** as our UI library
1. **[React Query](https://react-query.tanstack.com/)** to fetch data on the client

I would recommend having basic familiarity with these tools. If you're unfamiliar with any of them, read their "intro" or "basic" documentation to get an overview of how they work.

## How things work together

[TODO: Insert Diagram]

## Available scripts

We've abstracted most of the commonly used scripts to `package.json` as [idiomatic npm commands](https://docs.npmjs.com/cli/v7/commands/npm-run-script). Below are common commands you would use during local development:

- `npm run dev` - runs app in development mode (will refresh when files change)
- `npm run gen` - generates boilerplate for an end to end feature implementation
- `npm run test` - run unit tests
- `npm run prisma:migrate:dev` - run local database migrations
- `npm run prisma:seed` - seed the database
- `npm run stripe:dev` - run stripe webhooks locally
- `npm run docker:start` - start db/mailserver docker containers
- `npm run docker:stop` - stops all running containers
