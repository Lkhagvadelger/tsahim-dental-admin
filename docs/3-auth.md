# Authentication/Authorization

Authentication is handled by `@lib/auth` using the [Passport](http://www.passportjs.org/) library. Authorization is handled by `@lib/auth` using [CASL](https://casl.js.org/v5/en/) library.

## Authentication

We use cookies and sessions to determine who the current logged in user is. Sessions are stored inside of our PostgreSQL database.

### Passport

After a user has been authenticated, Passport sets `req.user` with the authenticated user. We use this value to store the user's id in the session and respond with a cookie to store on the client side.

### Why stateful authentication?

There are two broad types of authentication:

- **Stateless authentication** does not store anything anywhere, but adds the user data to the session (via session cookies or jwt)
- **Stateful authentication** stores a _session_ in the database every time a user authenticates

The tradeoff between them is:

- Stateful authentication requires a database query on every request.
- Stateless authentication only does a database query when the user authenticates.
- Stateful authentication allows you (or your users) to revoke sessions.
- You cannot revoke sessions with stateless authentication.

Stateless authentication bypasses the overhead of querying the database on each request which provides a more scalable solution for high frequency applications.

However, because it does not allow you to revoke sessions there are security risks which we decided are not worth the benefits of using stateless authentication.

## Authorization

We authorize if a user is authorized to create, read, or update a particular record(s) in the database right before we actually access the database.

### CASL

We define what database records a user can access based on their role. For example let's define the roles for an `Engagement` which is the interaction between a patient and a specialist.

#### Define rules

We define rules using casl based on each role and prisma model.

```
switch (user.role) {
  case "ADMIN":
    can("manage", "Engagement", "all");
    break;
  case "PATIENT":
    can("read", "Engagement", { patientId: user.id });
    break;
  case "SPECIALIST":
    can("manage", "Engagement", { specialistId: user.id });
    break;
  default:
    break;
}
```

##### GET /engagements

When we get a list of items, our casl syntax will vary from the other actions. Casl has a specific prisma library that allows us to use casl with where statements. This allows us to run the following code to get all engagements that a particular user is allowed to read.

```
return prisma.engagement.findMany({
  where: accessibleBy(ability).Engagement,
});
```

##### GET /engagements/:id

To authorize for getting an item, we pass in an instance of the prisma model.

```
ability.can("read", subject("Engagement", engagement))
```

##### POST /engagements/:id

To authorize for creating, we pass in an empty object.

```
ability.can("create", subject("Engagement", {}))
```

##### DELETE /engagements/:id

To authorize for deleting an item, we pass in an instance of the prisma model.

```
ability.can("delete", subject("Engagement", engagement))
```
