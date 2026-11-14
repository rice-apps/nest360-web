# NEST360 Web

A rebuild of [nest360.org](https://nest360.org) by RiceApps, in partnership with Rice360 and NEST360. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Payload CMS.

This README covers running the site on your own machine. For the design and architecture, see [`NEST360 Web — Design & Architecture Document.md`](./NEST360%20Web%20—%20Design%20%26%20Architecture%20Document.md).

---

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| [Git](https://git-scm.com/) | any recent | |
| [Node.js](https://nodejs.org/) | `^22.23.4` or `>=24.22.1` | The exact version is pinned in `.nvmrc` |
| npm | comes with Node | Use npm, not yarn or pnpm. The repo ships a `package-lock.json` |
| [Docker](https://www.docker.com/) | optional | Only if you want to run Postgres locally |

The simplest way to get the right Node version is [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows):

```bash
nvm install   # reads .nvmrc
nvm use
node -v       # confirm it matches .nvmrc
```

You do **not** need a database, Docker, AWS credentials, or a `.env` file for the default setup.

---

## Quick start

```bash
git clone https://github.com/rice-apps/nest360-web.git
cd nest360-web
nvm use
npm install
npm run dev
```

Then open:

- **Site:** http://localhost:3000
- **Admin (Payload CMS):** http://localhost:3000/admin

This runs against a private SQLite database on your machine. To work with the same content as the rest of the team, [connect to the shared dev database](#connect-to-the-shared-dev-database-neon).

The first time you open `/admin` on a fresh local database, Payload asks you to create a user. This account only exists in your local database, so use any email and password you like.

### Add starter content (optional)

A fresh install has an empty database. To fill it in, run any of these while in the project folder:

```bash
npm run seed            # starting tags (safe to run more than once)
npm run seed:sample     # sample content (see scripts/seed-sample.ts)
npm run seed:resources  # resource library entries (see scripts/seed-resources.ts)
```

---

## Connect to the shared dev database (Neon)

The team shares one Postgres development database hosted on [Neon](https://neon.tech) and provisioned through Vercel. When you connect to it, you see the same pages, resources, and users as everyone else, and everything you add shows up for them too. (Production will run on a separate database.)

### 1. Get the connection string

The connection string looks like this:
```
postgresql://USER:PASSWORD@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```
Ask a project lead to send it to you privately. Never post it in a public channel or commit it.

### 2. Add it to `.env`

```bash
cp .env.example .env      # skip if you already have a .env
```

```env
DATABASE_URL=postgresql://USER:PASSWORD@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_SSL=false
```

Keep `DATABASE_SSL=false`. That setting loads Amazon's RDS certificate and will break the Neon connection. Neon's SSL is handled by `?sslmode=require` in the connection string.

### 3. Bring the schema up to date and start the server

From an up-to-date `main`:

```bash
git pull
npm run payload migrate
npm run dev
```

Check the terminal. If you see `Nothing answers at DATABASE_URL ... using local.db (SQLite) instead`, you are **not** connected to Neon: the app falls back to SQLite when it can't reach the database. Check that the connection string is complete and correct, and that your network allows outbound connections on port 5432 (some campus or corporate networks block it), then restart the dev server.

### 4. Sign in

The shared database already has users, so `/admin` shows a login page instead of the create-user screen. Ask someone with an account to add you under **Users**. Once you have an account, you can set `PAYLOAD_AUTOLOGIN_EMAIL` to your email to skip the login page.

The first request after the database has been idle can take a few seconds while Neon 

### Switching back to local SQLite

Comment out `DATABASE_URL` in `.env` and restart `npm run dev`.

---

## How local data works

With no `DATABASE_URL` set, the app uses **SQLite** and keeps everything in the project folder:

| Path | Contents |
| --- | --- |
| `local.db` | the database (users, pages, resources, tags, etc.) |
| `media/` | uploaded images |
| `documents/` | uploaded documents |

All three are gitignored.

**To start over:** stop the dev server, delete them, and run `npm run dev` again.

```bash
rm -rf local.db media documents
```

Uploads stay on local disk unless `S3_BUCKET` is set, and dev uses a built-in `PAYLOAD_SECRET` if you don't set one.

---

## Environment variables (optional)

Only create a `.env` if you need to change a default:

```bash
cp .env.example .env      # Windows (cmd): copy .env.example .env
```

| Variable | Default when unset | What it does |
| --- | --- | --- |
| `DATABASE_URL` | SQLite in `local.db` | Postgres connection string (shared Neon database, Neon branch, or local Postgres). Setting it switches the app to Postgres. In development, if nothing answers at this address, the app falls back to SQLite and prints a warning. |
| `DATABASE_SSL` | `false` | Set to `true` **only** for AWS RDS in production. It loads Amazon's CA bundle from `certs/`. Leave `false` for Neon and local Postgres. |
| `PAYLOAD_SECRET` | built-in dev secret | **Required in production.** Generate with `openssl rand -hex 32`. |
| `PAYLOAD_AUTOLOGIN_EMAIL` | none | Local dev only. Email of an existing admin user to sign in as automatically, skipping the login page. |
| `S3_BUCKET` | uploads go to local disk | Set to send uploads to S3. Not used in development yet. Needs the three keys below. |
| `S3_REGION` | `us-east-1` | |
| `S3_ACCESS_KEY_ID` | none | |
| `S3_SECRET_ACCESS_KEY` | none | |
| `PREVIEW_SECRET` | none | Shared secret for draft previews. Generate with `openssl rand -hex 32`. |

Restart `npm run dev` after editing `.env`. Never commit `.env`.

---

## Optional: run Postgres locally

If you want a Postgres database that's entirely your own (for example, to test migrations offline), run one in Docker.

1. Start a database:

   ```bash
   docker run --name nest360-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=nest360 \
     -p 5432:5432 -d postgres:17
   ```

   (A Homebrew Postgres works too. Just create a `nest360` database.)

2. Set `DATABASE_URL` in `.env`:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nest360
   DATABASE_SSL=false
   ```

3. Run `npm run payload migrate`, then `npm run dev`. The database starts empty, so create an admin user and re-run any seed scripts you want.

Later, use `docker start nest360-db` / `docker stop nest360-db`. To wipe it: `docker rm -f nest360-db` and repeat step 1.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally (run `build` first) |
| `npm run lint` | Run ESLint |
| `npm run seed` | Add starting tags (idempotent) |
| `npm run seed:sample` | Add sample content |
| `npm run seed:resources` | Add resource library entries |
| `npm run generate:types` | Regenerate `payload-types.ts` after changing a collection, global, or field |
| `npm run generate:importmap` | Regenerate the admin import map after adding admin components or plugins |
| `npm run payload migrate:create` | Create a database migration for production |
| `npm run payload migrate` | Apply any pending migrations in `migrations/` to your database |

> **Rerun migrations on schema changes.** Whenever you pull changes that add files to `migrations/`, or you create a migration yourself, run `npm run payload migrate` before starting the dev server. Otherwise your database won't match the schema the code expects. For the shared database, the PR author does this once after merging.
