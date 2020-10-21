# Nest & Neo4j Starter Repository

## Dependencies

- **API:** `@nest` ...
- **Neo4j:** `nest-neo4j`
- **Authentication:** `passport`, `passport-jwt`, `passport-local`


## Config

## Authentication

Authentication is provided by the `AuthModule` in `src/auth/auth.module.ts`.  By default the user is identified by their email address and authenticated by their password.  You can identify the user by another property



### Registration

In order for a user to register, they must send a POST request to `/auth/register`.  The validation rules for this endpoint are defined in the [`CreateUserDto`](src/auth/dto/create-user.dto.ts).  By default a user is required to send an `email` and `password`, and can also optionally send a `firstName` and `lastName`.


The [`AuthController`](src/auth/auth.controller.ts) validates the request and passes the items defined in on the `CreateUserDto` object to the [`UserService`](src/auth/user/user.service.ts).  The user service then encrypts the password and attempts to create the node inside Neo4j before returning a `UserResponse` consisting of their `UserProperties` and `token` property containing a [JWT token](https://jwt.io) containing an object of `UserClaims` - a signed, Base64 encoded string which represents certain _claims_ about who the user says they are.  This information can be used to personalise the UI.

By default everything except the password is returned in the `UserClaims` - the JWT token can be easily decoded so nothing sensitive should be added to these claims.

To add additional properties to the User record, you will need to add the property (and any additional validation decorators) to the `CreateUserDto`.

To change the claims or the properties returned by the API, you can edit  `getClaims()` or `toJson()` methods in the [`User`](src/auth/user/user.entity.ts) entity class.


### Login

Once registered, a user must send a POST request to `/auth/register` with their `email` and `password`.  The endpoint will return the same response as the `POST /auth/register` endpoint.  The `token` should be stored by the client and sent with any subsequent requests to guarded API routes.


### Retrieving User Details

The user's details can be retrieved with a valid JWT token.  The information returned by the API is defined in the `toJson()` method in the [`User`](src/auth/user/user.entity.ts) entity class.


### Updating a User

The validation for the `PUT /auth/user` endpoint is taken care of by the [`UpdateUserDto`](src/auth/dto/update-user.dto.ts).  Any items defined in the DTO will be updated in Neo4j before an updated JWT is returned.


## Guarded Routes

You can use the `UseGuards` decorator to add the `JwtAuthGuard` to any route.  This will require the user to send a valid JWT token.  You can inject the current `User` entity into the route using the [`AuthUser`](src/auth/decorators/User.decorator.ts) decorator:


```ts
@UseGuards(JwtAuthGuard)
@Get('user')
getUser(@AuthUser() user) {
    return {
        ...user.toJson(),
        token: this.authService.createToken(user),
    }
}
```
