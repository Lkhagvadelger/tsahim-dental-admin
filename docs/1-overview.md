# Overview

The Mederva repository is a standard [Next.js](https://nextjs.org) app leveraging [Next APIs](https://nextjs.org/docs/api-routes/introduction) for server-side interactions. It's built with a full TypeScript stack so that code can be shared between backend and frontend.

You can find the entry point to each page url the `pages` directory. You'll notice that they are generally just a thin wrapper and most of the heavy lifting code is done in the `/libs` directory.

## Folder structure

```sh
│
├── pages # Entry point to the app (API and Web)
├── docs # Documentation
├── lib # Feature source code, this is where you'll spend most of your time!
│   ├── core # feature category
│   │   ├── api # feature API lib (define api routes and services)
│   │   ├── data # feature Data Access lib (define sharable data  services)
│   │   └── ui # feature UI lib (define ui components)
│   ├── auth
│   ├── patient-case
│   ├── file
│   ├── payment
│   ├── profile
│   └── user
├── prisma # Database schema
├── public # Static file assets
└── locales # i18n files
```

We explicitly split the app into a folder-by-feature structure to make it easier to navigate and share code.

## Libs

There are 4 kinds of libs that we use in the Mederva apps:

- **api** - feature API lib (define api routes and services)
- **data** - feature Data Access lib (define ui/api sharable data services)
- **ui** - feature UI lib (define ui components)
- **util** - utility lib (exports common api/web utilities)

We group each lib by a feature category. For example, the `auth` folder contains libs required for the authentication feature including `api`, `data`, and `ui` libs.
