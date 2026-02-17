---
title: 'Supabase Local Development: Default Values and API Usage'
date: '2025-12-06'
intro: When you run `supabase start`, Supabase launches a local backend with fixed values. These defaults make it easy to connect without extra setup.
image: './2025-12-06-supabase-local-dev-defaults-hero.png'
tag: 'reference'
---

## Default Configuration

When you run `supabase start`, Supabase launches a local backend with fixed values. These defaults make it easy to connect without extra setup.

Constant        | Value
----------------|------------------------------------------------------------------------
API URL         | http://localhost:54321
REST API        | http://localhost:54321/rest/v1
Auth API        | http://localhost:54321/auth/v1
Storage API     | http://localhost:54321/storage/v1
DB URL          | postgres://postgres:postgres@localhost:54322/postgres
DB Host         | localhost
DB Port         | 54322
DB User         | postgres
DB Password     | postgres
DB Name         | postgres
JWT Secret      | super-secret-jwt-token-with-at-least-32-characters-long
Anon Key        | Static JWT signed with the secret, role = anon
Service Role Key| Static JWT signed with the secret, role = service_role

## API Usage Examples

### API URL

Base entry point for all Supabase services.

```bash
curl http://localhost:54321
```

### REST API

Exposes database tables as REST endpoints.

```bash
curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
http://localhost:54321/rest/v1/my_table
```

### Auth API

Handles signup, login, and session management.

```bash
curl -X POST http://localhost:54321/auth/v1/signup \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"password"}'
```

### Storage API

Manages buckets and files.

```bash
curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
http://localhost:54321/storage/v1/bucket
```

### Database URL and Credentials

Direct connection string for Postgres.

```bash
psql "postgres://postgres:postgres@localhost:54322/postgres"
```

## Authentication Keys

### JWT Secret

Used to sign and verify JWTs. The anon and service role keys are derived from this secret.

### Anon Key

Static JWT with role `anon`. Include in headers for client-side requests.

```bash
curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
http://localhost:54321/rest/v1/my_table
```

### Service Role Key

Static JWT with role `service_role`. Use in server-side scripts for full access.

```bash
curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
http://localhost:54321/rest/v1/my_table
```

## Why It Matters

These defaults are always the same in local development, so you can rely on them for quick setup and testing across any stack.
