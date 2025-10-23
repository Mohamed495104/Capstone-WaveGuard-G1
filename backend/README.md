## Backend Security Practices

- All API endpoints strictly validate authentication tokens using Firebase Admin SDK.
- CORS is locked down to trusted frontend URLs only.
- No sensitive info (tokens, passwords, internal errors) is ever logged or returned in API responses.
- All user data and tokens are validated for type and presence before usage.
- Error responses are generic to avoid leaking server internals.