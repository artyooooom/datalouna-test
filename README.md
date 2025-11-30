# DataLouna-Test
## Installation
To run the project, copy .env.example to .env and replace the placeholder values with actual database/Redis/JWT settings.
There's also a Docker version.

## Docs
API docs are available under `/openapi` endpoint .

## Notes
- Some of the endpoints are guarded (purchasing `[post] /products/:id` and getting user purchases `/products/me`). 
Send requests with `Authorization` header containing Bearer token that could be obtained by signing in via `[post] /auth` endpoint.
Credentials are `admin:123`.
- Added one more additional endpoint - `/products/me` to get user purchases
