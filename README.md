# NEST360 Web

A rebuild of [nest360.org](https://nest360.org) by RiceApps, in partnership with Rice360 and NEST360.

## Mission

NEST360 works with governments in Africa to end preventable newborn deaths in hospitals through lifesaving technologies, clinician and biomedical technician training, and locally owned data.

## The problem

NEST360 hosts hundreds of clinical and biomedical resources (job aids, care modules, training videos) that healthcare teams and government partners depend on. The current website makes them hard to find. It is static, with flat images, static maps, and weak linking between pages, so visitors cannot search effectively or move from one resource to the next. Many of those visitors are in low-bandwidth settings, and the site's structure gets in the way of information that directly affects neonatal care.

## What we are building

A searchable, interconnected site that NEST360's own team can maintain without developers. The resource library comes first. After that come interactive maps and data visualizations, rebuilt navigation with country-specific pages, and tuning for low bandwidth. The site also links to NEST360's existing sites ([medicalrepairs.org](https://medicalrepairs.org/)).

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router) with TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Admin and content management | [Payload CMS](https://payloadcms.com) |
| Database | PostgreSQL ([AWS RDS](https://aws.amazon.com/rds/) in production) |
| File storage | [AWS S3](https://aws.amazon.com/s3/), through Payload's S3 adapter |
| Deployment | [Vercel](https://vercel.com) |

Until the backend is in place, the site runs on mock data in `lib/data/`.

## Timeline

| Milestone | Date |
| --- | --- |
| Resource library complete | End of 2026 |
| Remaining features rolled out | Spring 2027 |
| Final delivery | April 2027 |

## Who uses the site

- **Clinicians and biomedical engineers** need training resources: downloads, videos, and guides.
- **Policymakers and hospital leaders** need data and technical information.
- **Donors** need a quick narrative with impact over time.

Most visitors are on phones and pay for data by the gigabyte. Every decision in this codebase should keep pages small and fast.

## Getting started

You need Git and the Node.js version listed in `.nvmrc`. Nothing else: no database, Docker, or `.env` file.

```bash
git clone https://github.com/rice-apps/nest360-web.git
cd nest360-web
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) for Payload. The first time you open the admin, it asks you to create a user. Run `npm run seed` if you want the starting tags.

Without a `DATABASE_URL`, the site keeps its data in a SQLite file, `local.db`, in the project folder, and uploads in `media/` and `documents/`. All three are gitignored. Delete them to start over.

### Optional: use Postgres locally

Production runs on Postgres. To match it locally, start a database and point the site at it:

```bash
docker run --name nest360-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nest360 -p 5432:5432 -d postgres:17
cp .env.example .env
```

Then uncomment `DATABASE_URL` in `.env`. The site uses Postgres whenever `DATABASE_URL` is set. In `.env` you can also set `PAYLOAD_AUTOLOGIN_EMAIL` to an existing user to skip the admin login page while developing.

Development uses a built-in `PAYLOAD_SECRET` when none is set. Production must set its own, generated with `openssl rand -hex 32`. Uploads go to S3 only when `S3_BUCKET` is set.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Builds the site for production |
| `npm run generate:types` | Regenerates `payload-types.ts` after you change a collection |
| `npm run generate:importmap` | Regenerates the admin import map after you add admin components or plugins |
| `npm run seed` | Adds the starting tags (safe to run more than once) |
| `npm run payload migrate:create` | Creates a database migration for production |

Test with `dev`, and then run `build` before opening a pull request.

## Project structure

```text
app/
  (payload)/                 Payload admin and API routes (generated, do not edit)
  (frontend)/
    layout.tsx               site shell: header and footer
    page.tsx                 home page
    resources/
      page.tsx               resource library
      [slug]/page.tsx        one resource
    search/page.tsx          search results
    where-we-work/page.tsx   country map
collections/                 Payload collections: users, media, documents, tags, projects
components/                  shared interface components
lib/
  types.ts                   shared TypeScript types
  data/                      the only place pages get data from
payload.config.ts            Payload configuration
```

The public site lives in the `(frontend)` route group. The parentheses do not appear in URLs. The Payload admin sits beside it in the `(payload)` route group.

## Deployment

The site is deployed on Vercel. Every pull request gets a preview deployment, linked in the pull request itself. Merges to `main` deploy automatically.
