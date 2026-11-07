# NEST360 Web — Design & Architecture Document

RiceApps × Rice360 × NEST360 · Last updated Nov 6, 2026

## 1. Overview

We are rebuilding nest360.org as a Next.js site with Payload CMS, so that NEST360's hundreds of clinical and biomedical resources can be searched, and so non-technical staff can maintain the site after RiceApps hands it off. The searchable resource library is the must-have for the end of 2026. The rest of the site (home, articles, country map, impact pages) rolls out through April 2027.

**The problem.** The current WordPress/Divi site is static and hard to navigate. Search does not work, PDFs are unorganized and linked by hand, and staff track resources in a spreadsheet. Many visitors are clinicians in Malawi, Kenya, Tanzania, Nigeria and Ethiopia, on phones, on connections that top out around 10 Mbps, paying for data by the GB.

**Goals for this semester (by the 12/5 showcase)**

1. A resource gallery with working search and tag filters, end to end: a staff member adds a resource in the admin, it appears in the gallery, and it is found by name and tag.
2. An admin that a person with basic web skills can use: drafts, live preview, uploads, without touching code.
3. Page templates (articles, project pages, generic block pages, header and footer) that cover most of the current site's simple pages.
4. A design system from the Figma applied to the resource search, home, article and project pages.

**Non-goals this semester:** AI search assistant, auto-translation, Google Analytics dashboards, offline support, merging the change package and medicalrepairs.org into the main site, and full migration of every existing page. These are planned for spring 2027 or later (see Roadmap).

## 2. Users and requirements

Three personas drive the design. Clinicians are the primary user of the resource library; admins are the primary user of the CMS.

| Persona | Who | Needs |
| --- | --- | --- |
| Clinician / BMET | Nurses, doctors, biomedical engineers in partner hospitals | Find training resources quickly (job aids, modules, videos); reach the change package and medicalrepairs.org easily; use the site on a phone |
| Policymaker / hospital leader | Ministries, hospital heads, implementing partners | Data, technical information, research publications |
| Donor | Funders and prospective funders | Understand the mission fast; find where to donate; see impact stories and recent articles |
| Admin (NEST360 staff) | Communications team (e.g. Victory, Esalee), no dedicated web developer | Edit pages, images, headings and stories and see changes quickly; grant and revoke access; avoid code; get analytics and SEO data; later, per-language content |

**Functional requirements**

- Resource library: every resource (PDF, video, external link, publication) is its own record with title, summary, type, language and tags, and can appear on several project pages.
- Search by name and filter by tag, type and language, with clear empty and error states. Only published resources are visible to the public.
- Research publications stay a separate page but are also searchable in the main resource search.
- Drafts and live preview before publishing; existing URLs are kept (the client liked this).
- Upload documents and images once to a media library and reuse them anywhere.
- Links out to the change package (nest360-change-package.zahara.workers.dev), medicalrepairs.org, Hadli and Nest-it.
- "Where we work" map: show active countries and regions, hover for stats (hospitals, facilities). Low interactivity.
- Google Analytics on pages and on resource events (view, click, download), so staff can tell whether a visitor browsed a module, opened a resource or downloaded a PDF.

**Non-functional requirements**

- **Low bandwidth:** images under 200 KB, minimal client JavaScript, little or no parallax, videos hosted on Vimeo/YouTube rather than on our site.
- **Mobile-first:** most visitors are on phones; the header collapses on small screens.
- **Maintainability:** NEST360 can run and update the site after RiceApps leaves, including hosting it themselves (Rice stops sponsoring NEST360 in 2028, so a Kenyan host is likely).
- **Not American-centric:** user testing with partners in Africa after December; culturally appropriate imagery chosen per country from the leadership-approved photo bank.
- **Translatable:** keep interface text simple and centralized so it can be translated into Swahili, French and Portuguese later.

## 3. System architecture

The whole system is one Next.js application. The public site and the Payload admin run in the same process and share Payload's Local API, so pages query content directly, with no separate backend service to host.

Visitors hit server-rendered pages; editors use `/admin`. Both go through Payload, which applies access rules and hooks before reading or writing Postgres and S3.

| Component | Responsibility | Code |
| --- | --- | --- |
| Public site | Render pages; enter draft mode for previews | `app/(frontend)/`, `lib/data/` |
| Admin and API | Editing UI, REST and GraphQL endpoints (generated) | `app/(payload)/` |
| Schema | Collections, fields, access rules, hooks | `collections/`, `payload.config.ts` |
| Database adapter | Postgres when `DATABASE_URL` answers, else SQLite | `payload.config.ts` |
| Storage adapter | S3 when `S3_BUCKET` is set, else local disk | `@payloadcms/storage-s3` |
| PDF preview | First page of each uploaded PDF to a JPEG | `lib/pdfPreview.ts`, `collections/Documents.ts` |
| Migrations and seeds | Schema changes for production; sample data | `migrations/`, `scripts/` |

## 4. Technology choices

We chose a single Next.js app with Payload CMS embedded in it, replacing the earlier plan of a custom backend on Supabase. Payload gives NEST360 a no-code admin, drafts and versioning out of the box, and keeps content in a normal Postgres database they can take with them.

| Layer | Choice | Why | Alternatives considered |
| --- | --- | --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript | Server components send little JavaScript to phones; one repo for site and admin | Separate SPA + API |
| CMS | Payload 3.92 (runs inside Next.js) | Code-defined schema we version in Git; admin UI, drafts, live preview, access control and uploads built in; open source and self-hostable | WordPress + ACF (what they know, but the current pain); a fully custom CMS (too much to maintain) |
| Rich text | Lexical editor (`@payloadcms/richtext-lexical`) | Payload's default; renders to React on the server | — |
| Database | PostgreSQL (AWS RDS in production); SQLite file locally | Postgres for production; SQLite means `npm run dev` works with nothing installed | Supabase Postgres (earlier plan; still an option as a host) |
| File storage | AWS S3 via `@payloadcms/storage-s3`, local disk when no bucket is set | Browser uploads go straight to S3, avoiding Vercel's 4.5 MB request limit | Supabase Storage (earlier plan) |
| Styling | Tailwind CSS 4 | Fast to build the Figma design system as utility classes and tokens | — |
| Images | `sharp` (resizing) and `next/image` | Smaller, resized images for low bandwidth | — |
| PDF previews | `pdfjs-dist` + `@napi-rs/canvas` | Render a PDF's first page to a JPEG on upload | Manual thumbnails |
| Hosting | Vercel (current) | Preview deployment per PR, automatic deploys from `main` | See Infrastructure: long-term host is an open question |

Node 22.23.4+ or 24.22.1+ is required (`.nvmrc` pins 26.10.0).

## 5. Content model

Content lives in seven Payload collections on `main`, with three more (Pages, Header, Footer) on an open branch. The central decision, made in the 10/31 sprint, is that a **Resource** is its own record and a **Project** page only links to resources. Before, files were nested inside each project, which was hard to search and mixed up "making a page" with "describing a resource".

### Collections on `main`

| Collection | Purpose | Key fields | Drafts | Public read |
| --- | --- | --- | --- | --- |
| `resources` | One searchable document, video, outside link or publication | title, slug, summary, resourceType (document, video, link, publication), document, videoUrl, externalUrl, thumbnail, language (en, fr, pt, sw), tags, isNew, publication fields (authors, journalOrPublisher, publicationDate, doi, citation), projects (join, read-only) | Yes | Published only |
| `projects` | A resource page such as nest360.org/project/clinical-job-aids | title, slug, featuredImage, description (rich text), tag (one page tag), layout (list or groups), resourceGroups\[\] (title, description, resources), downloadAll, citation, relatedProjects | No | All |
| `articles` | Stories and news | title, slug, publishedDate, authors\[\] (name, role), tags, featuredImage, excerpt, content (rich text), attachments, meta (SEO title, description, image) | Yes | Published only |
| `documents` | Uploaded files: PDF, DOCX, XLSX, PPTX, MP4 | file, preview (auto-generated from a PDF's first page) | No | All |
| `media` | Images only | file, alt (required), 400×300 thumbnail size | No | All |
| `tags` | Shared labels | name, slug, usedFor (pages, files or both) | No | All |
| `users` | Admin accounts | email, password (Payload auth) | — | — |

### How they relate

- A project has resource groups; each group lists resources in display order. A resource can sit on several projects, and its `projects` join field shows which ones. Editing a resource updates every page that shows it.
- A resource of type `document` must have a file in `documents`; a publication needs a file or an external URL. Fields for other types are hidden and not validated.
- Every document that is a PDF gets a `media` preview image, made on upload. A resource can override it with its own thumbnail.
- Tags are filtered by `usedFor`: a project's tag field only offers page tags; a resource's tags field only offers file tags.

### Planned changes (11/7 sprint and after)

| Change | Reason |
| --- | --- |
| `authors` collection; articles reference it instead of an embedded array | Client asked for this on 10/27; avoids retyping the same person |
| Split `media` into a small set of upload collections (e.g. clinical PDFs, general images, icons) | Easier for staff to find the right file; different size and type rules per kind |
| `pages` collection with blocks (RichText, MediaWithText, HeadingWithList), and `header` and `footer` globals | Lets staff rebuild simple pages such as What We Do, Evidence-Based Care and Jobs (branch `Page_blocks`) |
| Drafts on `projects` | Today, saving a project page publishes it immediately, unlike articles and resources |
| Tag facets: add a `facet` field (country, topic, audience, format) to tags | One flat list of tags "scales badly" (10/6 concern); facets give the filter sidebar its sections without hard-coded categories |
| `countries` collection (name, ISO code, summary, hospital and facility counts, region) | Feeds the Where We Work map and country pages; `Country` type already sketched in `lib/types.ts` |

## 6. Frontend architecture

The public site is server-rendered React: pages are async server components that read from Payload's Local API (no HTTP hop), and only interactive pieces such as the filter sidebar are client components.

### Routes

| URL | File | Data | Status |
| --- | --- | --- | --- |
| `/` | `app/(frontend)/page.tsx` | — | Still the Next.js starter page; homepage shell is on `feature/homepage-content` |
| `/resources` | `resources/page.tsx` | Hard-coded array | Old category-section layout; replaced by the gallery on the resource-gallery branch |
| `/resources/[slug]` | `resources/[slug]/page.tsx` | `getProjectBySlug` | Working: project page with list or grouped layout, PDF previews, NEW badge, related projects |
| `/stories` | `stories/page.tsx` | Placeholder cards | Shell only |
| `/stories/[slug]` | `stories/[slug]/page.tsx` | `getArticleBySlug` | Working, with SEO metadata from `meta` |
| `/[slug]` | `[slug]/page.tsx` | `getPageBySlug` | On `Page_blocks`: renders a Page's blocks |
| `/preview`, `/exit-preview` | route handlers | Payload auth | Working: enter and leave draft mode |
| `/admin`, `/api/*` | `app/(payload)/` | Payload | Generated; do not edit |

The parenthesized folders are route groups: `(frontend)` is the public site with its own layout, and `(payload)` is the admin. They do not appear in URLs.

### Data layer

Pages get data only through `lib/data/*`. Each helper wraps `payload.find` and sets three things deliberately:

- `depth`: how many levels of relationships to fill in (projects use 3: groups → resources → documents → preview images).
- `overrideAccess: false` for public reads, so Payload applies the public access rules and unpublished resources come back as bare IDs, which the page skips.
- `draft` from Next's `draftMode()`, so preview shows the latest draft.

React's `cache()` deduplicates the lookup when a page and its `generateMetadata` ask for the same document. `lib/data/resources.ts` and `lib/data/site.ts` are still TODO stubs.

Types come from `payload-types.ts`, generated by `npm run generate:types`. `lib/types.ts` is an older hand-written draft that no longer matches the schema (for example its `ResourceType` values). **Proposal:** delete it, or keep only types that have no Payload equivalent, so there is one source of truth.

### Components and design system

Shared components go in `components/`. The resource-gallery branch adds `ResourceCard`, `ResourceGrid` and `ResourceFilters`; `Page_blocks` adds `RenderBlocks` and one component per block. The 11/7 sprint asks for primitive `Tag` and `Button` components that `ResourceCard` builds on.

The design system (colors, type scale, spacing) comes from the Figma and should live as Tailwind theme tokens in `globals.css`, not as hex values repeated in components. Today, colors like `#41B6C4` and `#0A4162` are hard-coded across pages. Mobile and desktop views are designed for every page.

**Pattern for page templates:** Payload owns the schema (a block's fields), and a React component renders each block type. `RenderBlocks` maps `blockType` to its component. New layouts are added as a block config in `blocks/` plus a component in `components/blocks/`.

## 7. Key flows

### Publishing an article (or resource)

1. An editor creates the article in `/admin` and clicks **Save Draft**. Payload stores it as a version with `_status: draft`.
2. The editor clicks **Preview**. The admin calls `previewFor('articles', …)`, which builds `/preview?path=/stories/<slug>&returnTo=<edit page>&previewSecret=…`. The button stays hidden until the article has a slug.
3. `/preview` checks the secret, checks that the visitor is a logged-in Payload user, turns on Next.js draft mode, saves `returnTo` in a cookie and redirects to the page.
4. The page reads with `draft: true` and shows an amber "You're viewing a draft preview" banner.
5. **Exit preview** turns draft mode off and returns the editor to the edit page.
6. The editor clicks **Publish**. Public reads, which only see `_status: published`, now include it. The URL stays the same as before.

**Next:** live preview (Payload's side-by-side preview that updates as you type), first for articles and resource pages, is planned for the 11/7 sprint. Resources have drafts but no preview URL yet, and projects have neither.

### Uploading a document and reusing it

1. The editor uploads a PDF to **Documents** (or from inside a resource's upload field).
2. With S3 configured, the browser sends the file straight to S3; the server never holds a large body.
3. A `beforeChange` hook renders page 1 to a 600 px JPEG with pdfjs, saves it to **Media** in the same transaction, and links it as the document's `preview`. If rendering fails, the upload still succeeds without a preview.
4. The editor creates a **Resource** pointing at the document, with summary, language and tags, and publishes it.
5. The editor adds the resource to one or more **Project** resource groups. It now appears on each of those pages and, once search is built, in the gallery.

### Adding a staff user

Any logged-in user can create users today. See Security for the role model we propose.

## 8. Resource search

Search is the client's top requirement. The design is a single gallery at `/resources` whose results are tiles, filtered by URL parameters on the server, so it works without JavaScript and every result set has a shareable link.

**What the 11/7 design review asked for:** no audience subheadings such as "Resources for healthcare professionals & BMETs"; one gallery of all resources so search can render results as tiles. The current implementation still looks like the old site's sectioned page.

### Approach

1. **Query state in the URL:** `/resources?q=cpap&tag=kenya&tag=training&type=document&lang=sw&sort=newest&page=2`. The resource-gallery branch already parses `tag`, `audience` and `sort` this way in `lib/resourceFilters.ts`.
2. **Filter in the database, not in memory.** The branch filters an in-memory list; that should move into a `where` clause in `lib/data/resources.ts` (`tags in [...]`, `resourceType equals`, `language equals`, `_status equals published`) with `limit` and `page` for pagination.
3. **Text matching in two stages.** Stage 1 (this semester): match title and summary with Payload's `like` operator, which works on both SQLite and Postgres. Stage 2: the Payload search plugin (`@payloadcms/plugin-search`, per the T1B Notion spec) keeps a `search` collection in sync on publish, with a priority per field, and can index articles and publications too. Postgres full-text search (`tsvector`) is the fallback if ranking is not good enough.
4. **One module, many types.** A shared `searchContent({ q, filters, collections })` helper that resources call first and articles reuse later, rather than two separate implementations. TLs decide this boundary.
5. **States:** loading (server render, so mostly none), empty ("No resources match" plus a link to clear filters), and error (a friendly message; the error is logged).

### Open design questions

- Audience: the branch adds a required `category` (audience) field on projects. Audience is better as a tag facet on resources, since a resource can serve several audiences, and the design asks for no audience sections.
- Does the gallery list resources, project pages, or both? The design shows resource tiles; clicking a tile opens its project page (11/7 "Project Page Frontend"). A resource on several projects needs one canonical page, or its own page.
- Multilingual search (Swahili, French, Portuguese titles) and later vector or AI-assisted search are spring 2027 work; the `search` collection is the place to add them.

## 9. Low bandwidth and mobile

Every page should be usable on a phone over a slow connection where the visitor pays per GB. The budgets below are our targets; none are measured or enforced yet.

| Area | Rule | How |
| --- | --- | --- |
| Images | Under 200 KB each (client requirement) | Add `media` image sizes (e.g. card, hero) in WebP; always render through `next/image` with `sizes`; avoid the full-size original on cards (the project page currently uses full images for PDF previews to avoid cropping) |
| JavaScript | Server components by default; client components only for interactive controls | Filters work through URL parameters and a submit button, so they work before JS loads |
| Rendering | Pages cached and revalidated on publish | Use Next.js static rendering with on-demand revalidation from Payload `afterChange` hooks, so most visits hit a cached page |
| Video | Never self-hosted on our pages | Embed or link Vimeo/YouTube behind a click-to-load poster image. `documents` currently accepts MP4; we should discourage or remove that |
| Motion | Few effects, no heavy parallax | CSS-only transitions; respect `prefers-reduced-motion` |
| Map | No mapping library | A static SVG of the countries with CSS hover states and stats from the `countries` collection |
| Fonts | One family, subset | `next/font` self-hosts Geist today; swap for the Figma font and limit weights |
| Downloads | Show file type and size on every resource card | Lets visitors decide before spending data; `ResourceSource.sizeBytes` in the old types anticipated this |

**Verification:** Lighthouse mobile runs on PR preview deployments with throttling, and page-weight checks on the home, gallery and project pages. User testing with partners in Africa after December is the real test.

## 10. Infrastructure and hosting

Today the site deploys to Vercel, with Postgres on AWS RDS and uploads in S3. Configuration is entirely through environment variables, so the same code runs locally with no setup.

### Environments

| Environment | Database | Uploads | Deploys |
| --- | --- | --- | --- |
| Local | SQLite `local.db`, or Postgres if `DATABASE_URL` answers within 1 s | Local `media/` and `documents/` folders | `npm run dev` |
| PR preview | Set in Vercel's preview environment (to confirm) | S3 | Vercel, per pull request |
| Production | RDS Postgres with SSL (Amazon CA bundle in `certs/`) | S3 | Vercel, on merge to `main` |

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL`, `DATABASE_SSL` | Postgres connection; SSL with the RDS CA when true |
| `PAYLOAD_SECRET` | Signs auth tokens; required in production |
| `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Upload storage; uploads stay local when the bucket is empty |
| `PREVIEW_SECRET` | Shared secret on preview links |
| `PAYLOAD_AUTOLOGIN_EMAIL` | Dev only: skip the admin login |

**Serverless details that matter:** the Postgres pool is capped at 5 connections, since every function instance opens its own pool. `next.config.ts` ships the RDS certificate and pdfjs fonts with the functions and keeps `pdfjs-dist` and `@napi-rs/canvas` outside the bundle.

**Shared dev data:** the 11/7 sprint makes a shared hosted database available to every developer, so everyone sees the same mock content. Today each developer has their own SQLite file, plus `npm run seed` (tags) and `npm run seed:sample` (sample resources and projects).

### Long-term hosting (open)

NEST360 asked us to recommend a host. Rice stops sponsoring NEST360 in 2028, so they will probably need a Kenyan host, and Vercel was flagged as expensive. Payload needs a running Node server and a database, so the site cannot be a purely static export. Options to evaluate:

- **Stay on Vercel + RDS + S3:** least work; costs and account ownership move to NEST360.
- **One container or VM** (Node + Postgres + object storage) at a provider with an African region or a Kenyan host: one bill, closer to users, but NEST360 must patch and back it up.
- **Managed Postgres and storage** (e.g. Supabase) with the app on a container platform: middle ground.
- **Serving under nest360.org during transition:** the client may keep WordPress for a while, so the new resource library may need to run at a subpath such as `/resources` through a reverse proxy, with Next.js `basePath`.

We should compare monthly cost, who holds the accounts, backups, and latency from Malawi and Kenya before recommending one. A handoff guide (setup, deploys, backups, rotating secrets) is part of the deliverable.

## 11. Security and access control

The public can read published content only; any logged-in user can do everything. The second half needs to change before NEST360 staff get accounts.

**Current rules**

- `articles` and `resources`: the public sees `_status: published`; logged-in users see drafts (`publishedOrLoggedIn` in `lib/preview.ts`).
- `projects`, `documents`, `media`, `tags`: public read. Create, update and delete require login (Payload's default).
- `/preview` requires both the preview secret and a logged-in Payload user, and only redirects to paths starting with `/`. `returnTo` must start with `/admin`, which prevents open redirects.
- Auto-login exists only under `next dev`.

**Proposed role model** (persona need: give and revoke access to trusted users)

| Role | Can |
| --- | --- |
| Admin | Everything, including users, globals and tags |
| Editor | Create, edit and publish articles, resources, projects and pages; upload files |
| Contributor | Create and edit drafts; cannot publish or delete |

Implement as a `role` select on `users`, with access functions per collection and field-level access on `_status`.

**Other items:** a stronger password policy and lockout (Payload's `auth.maxLoginAttempts`); limits on upload size; note that uploaded documents are public by URL even before the resource that uses them is published; and photo consent (for example parental permission for babies), which is handled by NEST360's approved photo bank. We should record on each image whether it is approved.

## 12. Current status

As of 6 Nov 2026, `main` has the CMS foundation, the content schema, draft preview and working project and article pages. The resource gallery, page blocks and globals are on open branches; search is not started.

### Known gaps on `main`

- Home page is still the Next.js starter; site title is "Create Next App".
- `/resources` is hard-coded; `lib/data/resources.ts` and `site.ts` are stubs.
- No header or footer, no tests, no CI beyond Vercel builds.
- README describes pages that don't exist yet (`/search`, `/where-we-work`) and says the site runs on mock data, which is no longer true.

## 13. Roadmap

Four sprints remain before the 12/5 showcase, and the gate there is the client's must-have: a resource added in the admin shows up in the gallery and is found by search. Everything else in spring 2027 builds on that.

Darker items in each sprint are the priority. Analytics, translation and AI search are deliberately last: the client wants them, but they add cost and complexity without serving the core persona needs first.

## 14. Risks and open questions

### Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Search slips past 12/5 | The one must-have is missed | Ship stage 1 (title/summary match + tag filter) first; the search plugin is stage 2 |
| Migration churn across branches | Broken deploys, lost collections (seen in #11 and on `Page_blocks`) | One migration per PR, generated after rebasing on `main`; never edit a merged migration |
| Client still unsure about Payload | Pushback on handoff | Demo the editor workflow at every client meeting; write the admin guide early |
| Hosting cost and ownership after 2028 | Site goes down or becomes unaffordable | Recommend a host this semester; keep the app portable (plain Postgres + S3-compatible storage) |
| Approved-photo workflow unclear | Unapproved images published | Approval flag on media; NEST360 is meeting internally with Sara about the photo bank |
| Content migration from WordPress | Hundreds of resources entered by hand | Import script from the client's resource spreadsheet and the WordPress media library |
| Map turns into heavy JavaScript | Slow pages in low-bandwidth areas | Static SVG with hover; push interactive features until it is measured |

### Open questions

| Question | Owner |
| --- | --- |
| Which host do we recommend to NEST360, and who pays? | TLs, with Sara |
| Will the new resource library live at a subpath of the WordPress site during transition? | TLs, with Ebony/Esalee |
| Does the gallery show resources, project pages, or both, and what is a resource's canonical page? | TLs + designers |
| One shared search module for resources and articles, or two? | Search pair + TLs |
| What tag facets do we standardize (country, topic, audience, format)? | Designers + client |
| Should staff edit all text on the site, or only images and statistics? | Client (asked 10/6) |
| Which Google Analytics events matter most (download, resource open, module browse)? | Client |
| Who on the NEST360 side approves content and design changes, and on what cadence? | Sara |
| How do translations work: Payload localization per field, or per-language resource records (as today)? | Spring 2027 |
