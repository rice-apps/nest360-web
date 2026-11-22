# Search failure tests

These tests check what visitors see on `/resources` and `/stories` when search can't load: for example, when
the database or the search index is down, or doesn't answer. Instead of a broken page or a "nothing matched"
message, both pages show **"We couldn't load … right now"** with a **Try again** button, and Try again brings
the results back once the problem is resolved. (`npm run test:search` checks the search *results*; these check
the failures.)

No database is stopped or changed by any of them.

## Fast tests

```bash
npm run test:search-failure
```

Takes a few seconds and needs no database, `.env` or running site: the tests hand the page loaders
(`lib/searchLoaders.ts`) fake data functions that fail, never answer, or recover. When every check passes, the
last line is:

```
All search failure tests passed
```

| Check | Expected result |
|---|---|
| The search index is down | A failure (`unavailable`), not empty results |
| The database is down | A failure (`unavailable`) |
| The database never answers | A failure (`timeout`) after the time limit, not a page that loads forever |
| It fails, then works again | Retrying returns the matching results |
| A story tag filter fails | A failure (tag filters also use the search index) |

## Browser tests

```bash
npm run dev                          # in one terminal
npm run test:search-failure:browser  # in another
```

Takes about a minute. It opens both pages in a browser and, for each, checks that:

- a failed search shows the error (the search text stays in the box, no "no results" message)
- Try again brings back exactly the results shown before the failure, at the same address
- Try again while it's still down keeps showing the error
- typing a search while search is down shows the error
- the whole database being down shows the error, and recovers

It only reads pages, so it's safe with any database, including the shared one. Use `BASE_URL` to test another
address, e.g. `BASE_URL=http://localhost:3001 npm run test:search-failure:browser`.

## Trying it by hand

Failures are simulated with a cookie that only works in development (`npm run dev`); production ignores it, so
visitors can never trigger it (`lib/simulatedFailure.ts`). With the dev server running, open
`http://localhost:3000/resources?q=cpap`, then in the browser console:

```js
// Break search (use 'database' instead of 'search' to break everything)
document.cookie = 'nest360-simulate-search-failure=search; path=/'
// Fix it again
document.cookie = 'nest360-simulate-search-failure=; path=/; max-age=0'
```

Reload after breaking it to see the error. After fixing it, click **Try again**.

## Changing the time limit

Pages give up and show the error after `SEARCH_TIMEOUT_MS` (10 seconds) in `lib/searchLoaders.ts`.
