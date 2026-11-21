# WordPress resources → Payload: small migration proof of concept

This copies a reviewed sample of public resource pages and their original PDFs into the existing
Payload collections. It is not a whole-site crawler, a synchronization service, or an article importer.
No WordPress credentials, AI service, new dependency, or schema migration is needed.

## Run it

From this branch's project directory, with the usual project dependencies installed and Python 3:

```sh
npm run migration:prepare
```

This fetches the three pages in `scripts/migration/sources.json`, extracts their introductions and the
five selected download links, validates/caches the PDFs, and writes `.migration-poc/manifest.json`.
If it fails, stop and review the error; do not substitute sample files for the originals.
Review the manifest's text, group names, language labels and source URLs, then run:

```sh
npm run migration:import
```

The importer prints the resource titles and IDs and writes `.migration-poc/report.json` for review.
It always uses **`.migration-poc/local.db`** and uploads under that same directory. It never imports
the app's database/storage configuration, uses DATABASE_URL, connects to S3, or changes the shared
database. These local records therefore will not appear in the normal deployed admin or resource
gallery. Shared/staging import and frontend review are a later, explicitly configured step.

## Selected sample

| Original page | Files selected | Why |
| --- | --- | --- |
| [Oxygen Cylinder Safety Guidelines](https://nest360.org/project/oxygen-cylinder-safety-guidelines/) | One guidelines PDF | Simple project and document |
| [Clinical Modules](https://nest360.org/project/clinical-modules/) | Syringe Pump; Bubble CPAP | Resources in separate titled groups |
| [Clinical Job Aids](https://nest360.org/project/clinical-job-aids/) | Canta V8-WN-NS, English and Portuguese | Language variants in one group |

The tiny source plan selects the sample and supplies reviewed classifications; the script discovers
the current file links and source descriptions automatically. To add another similar example, add a
source-plan entry using the page's exact heading/link text. Missing/ambiguous links stop preparation
for manual review instead of guessing. Other page structures may need a small extractor adjustment.

## Mapping and review

- Page title/intro → **Project** title/Lexical description; selected sections → resource groups.
- Original PDF → **Documents**, retaining identical bytes. Existing document hooks create PDF previews.
- Download label/reviewed title, document relationship, language → **Resources**, saved as **drafts**.
- Project audience comes from the source library section; its required page tag uses the source title.
- Original URLs, file checksums and resulting Payload IDs stay in the manifest/report. Keep these with
  the migration review; a future shared import can add source fields if staff need them in the admin.

Only five selected files are imported. Projects have no draft field, but remain in this isolated local
database. Resource summaries inherit the page's first paragraph and need per-file review. Resource
tags, publication dates and citations are not invented. Source-page images and inline hyperlinks are
not copied in this PoC; introduction text is preserved as paragraphs and PDF content is unchanged.
Articles are deferred until this resource path is checked with real files.

The importer matches resources by source file URL plus language, projects by source page URL, and
documents by content checksum. Reruns skip existing records, preserve manual edits, and resume after
a partial failure without recreating successful records. They do **not** update existing content when
WordPress changes; source refresh/update rules are outside this PoC.

## Verification

```sh
npm run test:migration
```

Tests use synthetic HTML/PDF fixtures and a disposable SQLite database with the actual project,
resource and upload schemas. They check language/link extraction, ambiguous-source failures,
checksum validation, original file bytes, grouped relationships, public draft exclusion, safe reruns
and preservation of manual edits. These tests do not demonstrate that the live website has been
migrated. A real run of prepare/import plus review of the report is required for that.

## Real sample verification — November 21, 2026

The preparation and import were run successfully against the original public files. Verified locally:

- 3 projects, 5 draft resources, 5 uploaded PDFs and 5 generated PDF previews.
- Every uploaded PDF matches its downloaded original byte-for-byte and by SHA-256 checksum.
- Project introduction paragraphs, selected group relationships and English/Portuguese labels match
  the prepared source manifest.
- Rerunning the importer skips all existing records and creates no duplicate projects, resources,
  documents or previews. Database foreign-key checks pass.

This completes the small resource migration proof of concept, not a shared-site rollout. The manual
review items above still apply, especially per-resource summaries and metadata not present on the
source listing. Articles and bulk/shared import remain follow-ups.

## Environment notes

Shell downloads are unavailable in the implementation environment; preparation was run from the
user's terminal and the resulting files/database were inspected locally. On python.org macOS installs
with no default CA certificates, the extractor uses `/etc/ssl/cert.pem`, keeping certificate and
hostname verification enabled. Full-app type checking requires the existing app dependencies and
generated Next.js route types; the isolated importer/tests do not require the app's search plugin or
deployment credentials.
