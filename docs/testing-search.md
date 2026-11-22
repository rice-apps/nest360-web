# Search tests

These tests check what the site search returns. They use the search code that `/resources` and `/stories`
use (`lib/data/search.ts`).

## Run them

From the project folder, after `npm install`:

```bash
npm run test:search
```

It takes about 10 seconds. When every check passes, the last line is:

```
PASS: search returns the matching resource; search and tag filtering work together.
```

When a check fails, the command stops with `AssertionError` and a sentence that says what was expected,
for example: *Searching "kangaroo" with the Thermal Care tag should return only the resource that has both*.

You don't need a database, a `.env` file or a running site. The test makes its own throwaway database,
fills it with a few sample resources, and deletes it at the end. Your `local.db` and the shared database
are never touched.

## What is checked

The sample content is two tags (Thermal Care, Respiratory Support) and four resources. One of them is a
draft that is not published.

| Check | Expected result |
|---|---|
| Search for "concentrator" | Only the oxygen concentrator job aid |
| Search for "oxygen" | Only the published oxygen resource, not the draft |
| Search for "kangaroo" | Both kangaroo resources |
| Search for "kangaroo" with the Thermal Care tag | Only the kangaroo resource with that tag |
| The Respiratory Support tag with no search text | Every published resource with that tag |

The tests check results only (which resources come back), not how the search works inside, so they keep
passing if the search code is rewritten in a way that gives the same results. They don't cover what happens
when the search fails (for example, when the database doesn't answer); those cases belong to the
search-failure tests.

## Adding a check

Add sample content and a new `assert.deepEqual(...)` in `tests/search.integration.ts`, with a sentence that
says what should happen. Compare slugs (the short names in page addresses), not titles or database IDs.
