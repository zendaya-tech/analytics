# Zendaya Analytics (Multi-tenant SaaS)

Next.js App Router + TypeScript + Prisma + PostgreSQL + Tailwind.

MVP implemented:
- Auth email/password + reset password
- Multi-workspace with active workspace switcher
- Site CRUD scoped by workspace
- Team invitations with hashed tokens + expiration
- RBAC roles: OWNER, ADMIN, ANALYST, VIEWER
- Strict server-side guard by `workspaceId` + role

## Stack

- Next.js 16 (App Router)
- Auth.js (NextAuth v5 beta, Credentials)
- Prisma + PostgreSQL
- Tailwind CSS
- Zod + React Hook Form
- Sonner (toast)

## Setup

1) Install dependencies

```bash
pnpm install
```

2) Configure env

Create `.env` (already included in this workspace) with at least:

```env
DATABASE_URL="postgresql://postgres:pgpass@localhost:5432/analitycs?schema=public"
AUTH_SECRET="replace-with-random-secret"
NEXTAUTH_SECRET="replace-with-random-secret"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="http://localhost:3000"
```

3) Generate Prisma client and apply migrations

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

4) Seed demo data

```bash
pnpm prisma db seed
```

Demo account:
- email: `owner@example.com`
- password: `Password123!`

5) Run app

```bash
pnpm dev
```

## Project tree

```text
app/
  api/
    auth/[...nextauth]/route.ts
    auth/register/route.ts
    auth/forgot-password/route.ts
    auth/reset-password/route.ts
    workspaces/route.ts
    workspaces/[id]/route.ts
    workspaces/[id]/invite/route.ts
    invites/accept/route.ts
    sites/route.ts
    sites/[id]/route.ts
    team/members/[memberId]/route.ts
    team/invites/[inviteId]/route.ts
  app/
    layout.tsx
    page.tsx
    workspaces/page.tsx
    sites/page.tsx
    team/page.tsx
  login/page.tsx
  signup/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx
  accept-invite/page.tsx
  layout.tsx
  page.tsx

components/
  forms/
  ui/
  login-client.tsx
  reset-password-client.tsx
  accept-invite-client.tsx
  workspace-switcher.tsx

lib/
  current-user.ts
  permissions.ts
  prisma.ts
  rate-limit.ts
  rbac.ts
  security.ts
  workspace.ts

prisma/
  schema.prisma
  migrations/202602170001_init/migration.sql
  seed.ts
```

## RBAC and tenancy

- All tenant-scoped tables include `workspaceId`.
- Route handlers verify both auth and role via:
  - `getCurrentUser()` in `lib/current-user.ts`
  - `requireWorkspaceRole(workspaceId, minRole)` in `lib/rbac.ts`
- Role/permission map in `lib/permissions.ts`.

Role policy:
- OWNER: full access + billing + workspace delete
- ADMIN: sites + members (except owner) + stats
- ANALYST: stats + events/segments + exports
- VIEWER: read-only stats

## Invite security

- Invite tokens are generated in plaintext once, then SHA-256 hashed before DB storage (`lib/security.ts`).
- Invite accepts only if token hash matches, status is `PENDING`, and `expiresAt` is valid.
- Basic in-memory rate limiting on invite endpoint in `lib/rate-limit.ts`.

## Example client fetch calls

Create workspace:

```ts
await fetch("/api/workspaces", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Growth Team" }),
});
```

Create site:

```ts
await fetch("/api/sites", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    workspaceId,
    name: "Main Site",
    domain: "example.com",
    timezone: "Europe/Paris",
    status: "ACTIVE",
  }),
});
```

Send invite:

```ts
await fetch(`/api/workspaces/${workspaceId}/invite`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "analyst@company.com", role: "ANALYST" }),
});
```

## GitHub CI/CD

The workflow is defined in `.github/workflows/ci-cd.yml`.

- CI runs on pull requests and pushes to `main`:
  - `pnpm install --frozen-lockfile`
  - `pnpm prisma generate`
  - `pnpm lint`
  - `pnpm build`
- CD runs only on push to `main`, after CI succeeds, and deploys to your VPS over SSH.

Required GitHub repository secrets:

- `VPS_SSH` (private SSH key allowed on the server)

Server prerequisites:

- Repo cloned at `/opt/analytics`
- Docker + Docker Compose installed
- External Docker network named `traefik` already exists
- App runtime env file available at `/opt/analytics/.env.production`

Traefik routing is configured in `deploy/docker-compose.prod.yml` for:

- `analytics.zendaya.tech`
