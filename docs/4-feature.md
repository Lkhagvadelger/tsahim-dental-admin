# Building a feature

In general, the workflow for building a CRUD feature is:

1. **Add to the database schema**: Add the new model to the Prisma schema in `prisma/schema.prisma`. For the sake of this explanation, let's use a `Post` as an example:

```prisma
# prisma/schema.prisma

model Post {
  # These are fields you should likely always store
  id              String        @id @default(cuid())
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  # These are our custom fields
  title      String
  body       String?
}
```

(Optional) **Add to CASL authorization**: Add your new model to the `libs/authorization/api/src/lib/abilities.ts` file to manage access control.

2. **Generate a lib for the feature**: Run `npm run gen` and enter `post` when asked for the resource name. This will generate the following:

```sh
├── lib
│   ├── post # feature category
│   │   ├── api # feature API lib (define api routes and services)
│   │   ├── data # feature data access lib (define data access methods)
│   │   └── ui # feature UI lib (define ui components)
```

3. **A CRUD endpoint and UI will be generated**: You'll notice that the command generates a full CRUD endpoint and UI for the new model based off of the model schema.

See [fx](https://github.com/foundinghq/fx) for more information on how these are generated.
