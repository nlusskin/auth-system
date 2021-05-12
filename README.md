# Requirements
Node 14+

# Setting up
1. Generate an environment file defining `PORT` and `JWT_SECRET`. These can be any value.
2. Run `yarn` to install packages
3. Provision the database using `npx knex migrate:latest`
4. Build the app using `yarn run build`
5. Start the server using `yarn run start`

Alternatively, you can run the available setup script using `yarn run setup`

# Features
The app has a few basic features:

### Authentication
Users can create accounts and login using the `/authenticate` endpoint
The schema is:
```
{
  email: EmailAddress,  // must be valid email
  password: String,    
  create: Boolean,      // set to 'true' if signup
  createdAt: DateTime
}
```
Authentication and refresh tokens are passed in the cookie header as `_jwt` and `_ref` respectively

Returns:
```
{
  userId: EmailAddress,
  token: JWT,
  refreshToken: RefreshToken
}
```

### Welcome
Authenticated users can request a welcome message and image using the `/welcome` endpoint
Returns:
```
{
  msg: String,
  img: URL
}
```

### UI
The UI handles authentication and displaying welcome messages, along with changing passwords
The app loads the default page, after which it queries the `/authenticate` endpoint to determine whether it has a valid token.
If not, the backend will try to refresh the token using the refresh token passed in the header. If it can refresh, a new auth token and refresh token are passed along and the request continues. If the token can't be refreshed, an error response is returned and the user must authenticate again with an email and password.

If the user is authenticated, the app state reflects this by displaying the `Welcome` component, which sends an authenticated request to the `/welcome` endpoint to retrieve the day's message and image.

# Structure
The app is broadly split into a few parts:

### /db
Contains the database driver for [Knex](https://knextjs.org) and migrations.
Also houses the SQLite database file once provisioned. The SQLite database contains users and refresh tokens. It is not seeded.

### /frontend
Holds the React app:
 - /components: Reusable components directory
 - /hooks: Custom React hooks
 - /pages: App views
 - /providers: Context providers for global app states

### /public
Stylesheets, compiled scripts, etc.

### /routes
API routes

### /lib
Helper functions for signing tokens, middlewares, etc.

### /tests
Automated unit tests

### /views
Hold the view controllers used by Express

# Testing
Tests are built using [Jest](https://jestjs.io])
Run tests using `yarn run test`

# TODOs and Considerations
Some things to consider for implementation in a production system:
 - Security: Passwords are stored in plaintext in a SQLite database file. This is neither secure nor stable enough for a production system. Passwords should be salted before being written and the database should exist as a standalone instance, either managed or unmanaged. It should be backed up and redundant to reduce downtime. In production, we'd also use SSL to secure transmissions.
 - Scalability: This app only has a couple routes, but for larger apps it would make more sense to use a frontend framework like Next to handle routing.
 - Styling: Production apps should have a style guide and component library.
 - Tests: More robust tests for more edge cases. The small number of tests currently written is simply a result of the time constraints.
 - Documentation: This README should be cleaned up and a dedicated documentation page set up.
 - Load balancing: This app uses the built in Express server to listen on a port for requests. In production, we'd want to load balance and potentially turn the associated service into serverless functions
 - Email verification: This app doesn't verify emails to keep the project self-contained for evaluation purposes. Ideally, this app would use an email server to send verification links, password reset links, new login notifications, etc.