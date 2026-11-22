# Testing pages in a real browser

These tests open the site in a real browser (headless Chrome, through Playwright) and check what a visitor
sees. They don't check how the code works inside, so they keep passing when the code is reorganized and fail
only when what visitors see changes.

## Run it

From the project folder, after `npm install`:

```bash
npm run test:article-page
```

It takes about 2 minutes. On success it ends with a line starting with `PASS:` and exits with code 0. On
failure it prints what was expected and what the page showed, and exits with code 1.

The first run also downloads the headless Chrome that Playwright uses (about 100 MB). Later runs reuse it.
The bandwidth script (`npm run measure:bandwidth`) uses the same one.

To skip the build when only the test file changed, reuse the last build in `.next`:

```bash
SKIP_BUILD=1 npm run test:article-page
```

## What it checks

`tests/article-page.e2e.ts` checks that **an article page shows the title supplied by the database**:

1. It creates a throwaway SQLite database in a temporary folder and saves one published article there. The
   article has a made-up title that is different each run, such as "Neonatal care in Malawi 3f9a12c0", plus
   the tag and picture every article needs.
2. It builds the site (`next build`), the way visitors get it, and starts it on a free port against that
   database.
3. It opens `/stories/<slug>` in headless Chrome and checks that:
   - the page loads (status 200);
   - the page heading is exactly that title;
   - the browser tab title starts with that title.
4. It stops the site, deletes the test picture and removes the temporary database.

Because the title is new each run, the test can only pass if the page really shows what the database holds.

## Your data is safe

- The test never touches `local.db`, the shared Postgres database or S3.
  - It points the site at its own database with `PAYLOAD_SQLITE_FILE`, an optional setting in
    `payload.config.ts`. When it isn't set, the site uses `local.db` as usual.
  - It also blanks `DATABASE_URL` and `S3_BUCKET` for the test only.
- The test picture is uploaded to the `media` folder and deleted again at the end.
- Your own `npm run dev` can keep running during the test. The test starts its own server on a different
  port.

## If it fails

| Message | What to do |
|---|---|
| `The build failed` | The last lines of the build log are printed. Run `npm run build` to see the full error. |
| `The site did not start` | The last lines of the server log are printed. Check that `npm install` was run after pulling. |
| `/stories/… should load` with a status like 404 or 500 | The story page itself is broken: open any story with `npm run dev` to see the error. |
| `The page heading should be the title saved in the database` | The page shows a different heading. The message shows both titles. |

## Adding another page test

Copy `tests/article-page.e2e.ts`. Change the content it saves in step 1 and what it checks in step 3, then add
a `test:<name>` script to `package.json`. Keep checking what a visitor sees, such as headings, links and text,
rather than class names or component internals.

Search tests are separate (`tests/search.integration.ts`; see [testing-search.md](testing-search.md)). Search
failures are covered by the search-failure task, so don't add tests for those here.
