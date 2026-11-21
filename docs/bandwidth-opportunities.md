# Ways to reduce data for visitors on poor connections

This list covers what makes our pages download more data than they need, and how we could make each one smaller. It comes from reading the code; it doesn't change any.

The numbers below are estimates from the code and the files in the local database. `scripts/measure-bandwidth.ts` (see [bandwidth-testing.md](bandwidth-testing.md)) gives the real transferred sizes. Run it before and after a fix to confirm the saving.

The three pages we measure are:
- the resource gallery (`/resources`)
- a project page (`/resources/[slug]`)
- an article page (`/stories/[slug]`)

The header and footer appear on all three.

**Priority:**
- **High:** loads on every page, or downloads several times more than it shows.
- **Medium:** a clear saving on one page type.
- **Low:** small, or only matters later as content grows.

## Summary

| # | Problem | Pages | Priority | Effort |
|---|---|---|---|---|
| 1 | The logo downloads at about 1,000–2,000 px wide but displays about 180 px wide | All (header and footer) | High | Small |
| 2 | Two unused fonts are downloaded on every page | All | High | Small |
| 3 | The PDF cover picture downloads at 640–1,200 px for a 240 px box | Project pages | Medium | Small |
| 4 | Country pictures are sent as the original upload, at full size and all at once | Pages with countries (for example, Where We Work) | Medium | Small |
| 5 | Images are sent as WebP only; AVIF would be about 20% smaller | All | Medium | Small |
| 6 | Uploads have no size limit, so an editor can upload a 5 MB photo | All, as content grows | Medium | Small |
| 7 | `/stories` lists every article, and `/resources` up to 100, on one page | Gallery pages | Low now, grows with content | Medium |
| 8 | Download links don't show file sizes | Project pages | Low | Small |
| 9 | Videos: plan for this before videos are shown on pages | Future | Low (plan ahead) | — |
| 10 | Pages are rebuilt on every visit, so the browser never reuses a stored copy | `/resources`, Pages | Low | Medium |

## Images

### 1. The logo is downloaded much larger than it's shown (High)

**Where:**
- `components/HeaderNav.tsx`: the header logo, on every page.
- `components/SiteFooter.tsx`: the footer logo, on every page.

**Why it costs data:**
- The logo upload (`NEST360.png`) is 1000 × 262 px and 110 KB.
- Both components pass the image's own width (`width={logo.width}`), so Next.js offers versions sized to 1,000 px: 1,080 px wide on normal screens and 2,048 px on high-density phone and laptop screens.
- The logo is drawn 40–48 px tall, which is about 150–180 px wide.
- So visitors download a file about 6–11 times wider than needed, twice per page.

**How to make it smaller:**
- Pass the size the logo is shown at, for example `width={184} height={48}`, keeping the shape of the image. Next.js then offers 256 px and 384 px versions instead.
- Better still, upload the logo as an **SVG**. A simple logo is usually a few KB and stays sharp at any size. The Media collection already accepts `image/*`.

### 2. Two fonts are loaded but not used (High)

**Where:** `app/(frontend)/layout.tsx`.

**Why it costs data:**
- The layout loads four font families: Geist, Geist Mono, Poppins (3 weights) and DM Sans.
- The design uses only **Poppins** (headings) and **DM Sans** (body), as `globals.css` shows.
- **Geist** is never used.
- **Geist Mono** is only used by the placeholder `<code>` on the starter homepage (`app/(frontend)/page.tsx`), which will be replaced.
- Next.js tells the browser to fetch fonts early (preload) on every page, so these files compete with the page's real content on a slow connection.

**How to make it smaller:**
- Remove `Geist` and `Geist_Mono` from `layout.tsx` and their variables from the `<html>` class.
- Point `--font-mono` in `globals.css` at a system font stack, such as `ui-monospace, monospace`, which downloads nothing.
- Keep Poppins to the weights the design uses. It's already limited to 400, 600 and 700.

### 3. The PDF cover picture on project pages is too large (Medium)

**Where:** `app/(frontend)/resources/[slug]/page.tsx`, the `topPreview` image.

**Why it costs data:**
- PDF previews are rendered 600 px wide (`PREVIEW_WIDTH` in `lib/pdfPreview.ts`).
- The page passes that width to `<Image>`, but shows the image in a 240 px box (`w-60`).
- Next.js therefore offers 640 px and 1,200 px versions for a 240 px space.

**How to make it smaller:**
- Pass the displayed size, `width={240}` with a height that keeps the shape, or add `sizes="240px"`.
- Either way, visitors get the 256 px or 384–640 px version instead of 640–1,200 px.

### 4. Country pictures use the original upload (Medium)

**Where:** `app/(frontend)/[slug]/page.tsx`, the country cards (`<img src={image.url}>`).

**Why it costs data:**
- This is the only plain `<img>` on the site. It skips Next.js image resizing, so every visitor gets the original file at full size and in its original format.
- It also loads all country pictures as soon as the page opens, even those further down.

**How to make it smaller:**
- Use `next/image` with `sizes` matching the grid, like `StoryCard` does. Visitors then get a resized WebP or AVIF that loads only when scrolled into view.
- If a plain `<img>` is kept, at least add `loading="lazy"` and use the Media `thumbnail` size (`image.sizes.thumbnail.url`).

### 5. Turn on AVIF (Medium)

**Where:** `next.config.ts`. There is no `images` setting, so the default is WebP only.

**Why it costs data:** the Next.js 16 docs say AVIF is about 20% smaller than WebP. Browsers that don't support AVIF fall back to WebP automatically.

**How to make it smaller:** add `images: { formats: ['image/avif', 'image/webp'] }`.

The trade-off: the first request for each image is a bit slower, because AVIF takes longer to encode. After that the result is cached.

### 6. There's no size limit on uploads (Medium)

**Where:** `collections/Media.ts`. The only setting is a 400 × 300 `thumbnail`; originals are stored at whatever size is uploaded.

**Why it costs data:**
- An editor can upload a 6,000 px, 5 MB phone photo.
- Anything that uses the original URL then sends the whole file: the country cards (#4), and any future plain `<img>`.
- Next.js also has to fetch and shrink that original before it can send a small version.

**How to make it smaller:**
- Add `resizeOptions: { width: 2000, withoutEnlargement: true }` and `formatOptions: { format: 'webp', options: { quality: 80 } }` to the Media upload settings. Payload then stores a reasonably sized original.
- Optionally add a `card` size around 800 px for gallery cards.

## Page content

### 7. Gallery pages load every item at once (Low now, grows with content)

**Where:**
- `lib/data/articles.ts`: `/stories` uses `pagination: false`, so all articles are loaded.
- `lib/data/resources.ts` and `app/(frontend)/resources/page.tsx`: up to 100 resources.

**Why it costs data:**
- The images already load only as they scroll into view, because `next/image` loads lazily by default.
- But the page's HTML, and the page data Next.js sends with it, grow with every card. With hundreds of articles, the first page load gets noticeably heavier.

**How to make it smaller:**
- Show the first 12–24 items, with a "Load more" button or page numbers.
- Keep the search, filters and sort in the URL, as they are now, so paging works with them.

### 8. Show file sizes next to downloads (Low)

**Where:** the View / Download buttons and "Download all (.zip)" in `app/(frontend)/resources/[slug]/page.tsx`.

**Why it matters:**
- On a poor connection, a visitor can't tell whether a download is 200 KB or 40 MB before starting it.
- The zip is built on the server and streamed (`download/route.ts`), which is good: visitors download only the zip. But it can be large.

**How to improve it:**
- Show each file's size from Payload's `filesize` field next to its button, for example "Download (2.4 MB)".
- Show the total size on "Download all".
- This doesn't reduce data by itself, but it lets people choose.

### 9. Videos: decide how they load before they appear on pages (Low, plan ahead)

**Where:**
- `collections/Videos.ts`: MP4 uploads.
- Resources with a video URL.

Neither is shown on a page yet.

**Why it will cost data:**
- An `<video>` tag can start downloading the video as soon as the page opens.
- An embedded YouTube player downloads roughly 0.5–1 MB of scripts before anyone presses play.

**How to keep it small:**
- For uploaded videos, use `preload="none"` and a `poster` image.
- For YouTube or Vimeo, show a thumbnail with a play button and load the player only when clicked. This is known as a "facade" or "lite embed".

### 10. Pages are rebuilt on every request (Low)

**Where:**
- `app/(frontend)/resources/page.tsx` calls `connection()`.
- `app/(frontend)/[slug]/page.tsx` has `dynamic = 'force-dynamic'`.

**Why it costs data:**
- These pages can't be cached by the browser or a CDN, so returning visitors re-download the HTML each time.
- The HTML is small compared with images. This mainly affects speed on slow connections.

**How to improve it:** where content only changes when an editor publishes, cache the page and refresh it on publish (Payload `afterChange` hook plus `revalidatePath`).

## Already in good shape

- **Code sent to the browser is small.**
  - Most components render on the server.
  - Only a few small interactive pieces run in the browser: the mobile menu, the search boxes, the filters and the sort menu. None imports a large library.
  - `pdfjs-dist` and `@napi-rs/canvas` (PDF previews) and `fflate` (zips) run only on the server.
- **Images use `next/image` almost everywhere,** so they load lazily. Most also have correct `sizes`: `StoryCard`, `ResourceCard`, the article image and the page blocks.
- **Payload's live-preview script loads only in draft preview** (`isDraftMode` in `layout.tsx`), so regular visitors don't download it.
- **Fonts use `next/font`,** which hosts them with the site, avoids a request to Google and shows text in a fallback font while they load.

## Suggested order

Fixes #1, #2 and #3 are a few lines each and affect every page or the project pages. Do them first and measure with Laksh's script before and after. Fixes #4–#6 come next, and #7–#10 as content grows.
