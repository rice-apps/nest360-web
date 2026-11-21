# Measuring how much data pages download

Many NEST360 visitors are on slow or expensive mobile connections. This script measures how much data the
site's pages download, so the numbers can be compared before and after a change, and as content is added.

## Run it

From the project folder, after `npm install`:

```bash
npm run measure:bandwidth
```

That's all. It takes about 2 minutes. It:

1. downloads the headless Chrome it uses, the first time only (about 100 MB);
2. builds the site the way visitors get it (`next build`), because the development version (`npm run dev`) is
   several times larger;
3. starts that build on a free port, measures, and stops it again;
4. prints a summary table and writes the full report to `bandwidth-reports/<date and time>/report.md`.

While it runs, a progress bar shows how far along it is and which step it is on.

It uses the same database as `npm run dev`: `local.db`, or the database in `DATABASE_URL` if one answers.
If the build stops with "no such column", `local.db` is older than the code: run `npm run dev` once, open
the site, stop it, and run the script again.
The `bandwidth-reports` folder is not committed. Attach or paste a report where the team needs it.

## Which pages

- The resource gallery, `/resources`
- One project page: the most recently updated project, which the script asks the site for at `/api/projects`
  (no page links to projects since the `/resources` redesign)
- One article page: the first story card on `/stories`

The project and article are found on the site each time, so the script keeps working as content changes. The
report names the pages it used and how much content the site had, because more content changes the numbers.
To measure a specific page instead (for example, to compare one page before and after a change):

```bash
npm run measure:bandwidth -- --project=/resources/clinical-job-aids --article=/stories/my-story
```

## How each page is loaded (cache settings)

Every page is loaded four times, each time in a fresh browser with a phone-sized screen (Pixel 7):

| Load | Cache | Connection | What it shows |
|---|---|---|---|
| First visit | Empty | Full speed | Everything a new visitor downloads. Then the script scrolls to the bottom, and "Whole page" adds anything that only loads when scrolled into view. |
| Repeat visit | Kept from the first visit | Full speed | What a returning visitor downloads again. |
| Slow 4G | Empty | 1.44 Mbit/s down, 675 kbit/s up, 562.5 ms extra per request (Chrome DevTools' "Slow 4G" preset) | How long the page takes, plus screenshots at 2 s, 5 s, 10 s and when loading finished. |
| 3G | Empty | 400 kbit/s down, 400 kbit/s up, 2 s extra per request (Chrome DevTools' "3G" preset) | The same, on a much slower connection. |

"Data" is what travelled over the network, compressed and with headers: the same as the "transferred" column
in Chrome DevTools' Network tab.

## Reading the report

- **Summary:** data and number of requests per page and per load.
- **Data by kind:** JavaScript, fonts, images, CSS, page HTML and data requests (Next.js loads the data for
  linked pages in advance).
- **10 largest requests:** the best places to start when making a page smaller. Pictures show the original
  file and the width Next.js resized it to.
- **Timing:** when the first content, the largest content and the full page appeared, at full speed, on
  Slow 4G and on 3G. The summary table has a column for each.
- **Screenshots:** what a visitor on each slow connection sees while waiting.

## Options

```bash
npm run measure:bandwidth -- --help
```

| Option | What it does |
|---|---|
| `--skip-build` | Reuse the last build in `.next` (faster when the code hasn't changed) |
| `--url=<address>` | Measure a site that is already running, e.g. `--url=https://nest360-web.vercel.app` |
| `--project=<path>`, `--article=<path>` | Measure these pages instead of the first ones found |
| `--desktop` | A 1440 × 900 desktop window instead of a phone |

## Limits

- Numbers from a local build don't include the hosting service. The published site (Vercel) may compress
  files a little better. Use `--url` to measure it directly.
- The script measures one phone size. Pictures are downloaded at different sizes on other screens.
- Numbers change with content. Compare reports that list similar content, or measure the same pages with
  `--project` and `--article`.
