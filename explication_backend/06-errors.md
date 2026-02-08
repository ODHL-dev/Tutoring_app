# Backend - Errors

Format standard
{
  "error": {
    "code": "AUTH_INVALID",
    "message": "Identifiants invalides",
    "details": { }
  }
}

Codes proposes
- AUTH_INVALID
- AUTH_EXPIRED
- AUTH_FORBIDDEN
- RESOURCE_NOT_FOUND
- VALIDATION_ERROR
- RATE_LIMIT
- SERVER_ERROR

HTTP status
- 400 validation
- 401 auth
- 403 forbidden
- 404 not found
- 429 rate limit
- 500 server

