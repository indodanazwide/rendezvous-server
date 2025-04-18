# Session-based authentication system

The system uses opaque session tokens stored in a cache (like Redis or Memcached). 

- **Security**: By generating opaque, cryptographically secure session tokens.
- **Performance**: Utilizing in-memory stores like Redis or Memcached for quick access.
- **Flexibility**: Allowing configurable session expiry and refresh periods.

By avoiding JWTs, I sidestep issues like token bloat and the complexities of token invalidation. This approach ensures that tokens are lightweight and can be easily managed, providing a seamless experience for your users.


---

## Key Components

1. **Session Management**
    - **Token Generation**: Use a cryptographically secure hash function to generate session tokens.
    - **Token Storage**: Store tokens in a cache with an expiry time and a grace period for renewal.

2. **Authentication Flow**
    - **Login**: Verify user credentials and generate a session token upon successful login.

    - **Session Verification**: On each request, check the token's validity and expiry. If expired but within the grace period, allow token renewal.​

3. **Security Measures**

    - **Token Opacity**: Ensure tokens don't contain identifiable information.

    - **Secure Storage**: Use secure methods to store and retrieve tokens from the cache.