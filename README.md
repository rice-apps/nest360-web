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
| Database and file storage | [Supabase](https://supabase.com) |
| Admin and content management | Potentially [Payload CMS](https://payloadcms.com), pending client approval |
| Deployment | [Vercel](https://vercel.com) |

Until the backend is in place, the site runs on mock data in `data/`.

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

You need Git and the Node.js version listed in `.nvmrc`.

```bash
git clone https://github.com/rice-apps/nest360-web.git
cd nest360-web
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Builds the site for production |

Test with `dev`, and then run `build` before opening a pull request.

## Project structure

```text
app/
  (frontend)/
    layout.tsx               site shell: header and footer
    page.tsx                 home page
    resources/
      page.tsx               resource library
      [slug]/page.tsx        one resource
    search/page.tsx          search results
    where-we-work/page.tsx   country map
components/                  shared interface components
lib/
  types.ts                   shared TypeScript types
  data/                      the only place pages get data from
data/                        mock data files
```

The public site lives in the `(frontend)` route group. The parentheses do not appear in URLs. This leaves room for an admin area to sit beside it later.

## Deployment

The site is deployed on Vercel. Every pull request gets a preview deployment, linked in the pull request itself. Merges to `main` deploy automatically.
