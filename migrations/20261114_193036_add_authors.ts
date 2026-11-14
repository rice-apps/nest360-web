import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "articles_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "_articles_v_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "authors_name_idx" ON "authors" USING btree ("name");
  CREATE INDEX "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_rels_authors_id_idx" ON "articles_rels" USING btree ("authors_id");
  CREATE INDEX "_articles_v_rels_authors_id_idx" ON "_articles_v_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");`)

  // Move the authors typed into each article (the old embedded `authors` list) into the Authors
  // collection, and link them through the article's new `byline` field. Written by hand below; the SQL
  // above was generated. The old author rows are only read, never changed or deleted.

  // 1. One author per distinct name, from both the articles and their saved versions (drafts too).
  //    The old role becomes the bio. If a name had several roles, a non-empty one wins.
  //    Names that already exist in Authors are skipped, so running this twice adds nothing.
  await db.execute(sql`
    INSERT INTO "authors" ("name", "bio")
    SELECT DISTINCT ON (TRIM("name")) TRIM("name"), NULLIF(TRIM("role"), '')
    FROM (
      SELECT "name", "role" FROM "articles_authors"
      UNION ALL
      SELECT "name", "role" FROM "_articles_v_version_authors"
    ) AS old
    WHERE TRIM(COALESCE("name", '')) <> ''
      AND NOT EXISTS (SELECT 1 FROM "authors" a WHERE a."name" = TRIM(old."name"))
    ORDER BY TRIM("name"), NULLIF(TRIM("role"), '') IS NULL;
  `)

  // 2. Link each article to its authors, in the same order as before. Articles that already have a
  //    byline are skipped.
  await db.execute(sql`
    INSERT INTO "articles_rels" ("order", "parent_id", "path", "authors_id")
    SELECT old."_order", old."_parent_id", 'byline', a."id"
    FROM "articles_authors" old
    JOIN "authors" a ON a."name" = TRIM(old."name")
    WHERE NOT EXISTS (
      SELECT 1 FROM "articles_rels" r WHERE r."parent_id" = old."_parent_id" AND r."path" = 'byline'
    );
  `)

  // 3. The same for every saved version, so drafts, version history and restores keep their authors.
  await db.execute(sql`
    INSERT INTO "_articles_v_rels" ("order", "parent_id", "path", "authors_id")
    SELECT old."_order", old."_parent_id", 'version.byline', a."id"
    FROM "_articles_v_version_authors" old
    JOIN "authors" a ON a."name" = TRIM(old."name")
    WHERE NOT EXISTS (
      SELECT 1 FROM "_articles_v_rels" r WHERE r."parent_id" = old."_parent_id" AND r."path" = 'version.byline'
    );
  `)

  // The search index needs no update here: it already holds these same author names, copied from the
  // old list. It switches to the Authors collection the next time each article is saved.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Removes the Authors collection and the byline links. The old embedded author rows were never
  // touched, so articles go back to showing them.
  // IF EXISTS added by hand: DROP TABLE ... CASCADE already removes the foreign keys below.
  await db.execute(sql`
   DELETE FROM "articles_rels" WHERE "path" = 'byline';
  DELETE FROM "_articles_v_rels" WHERE "path" = 'version.byline';
  ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "authors" CASCADE;
  ALTER TABLE "articles_rels" DROP CONSTRAINT IF EXISTS "articles_rels_authors_fk";
  
  ALTER TABLE "_articles_v_rels" DROP CONSTRAINT IF EXISTS "_articles_v_rels_authors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_authors_fk";
  
  DROP INDEX IF EXISTS "articles_rels_authors_id_idx";
  DROP INDEX IF EXISTS "_articles_v_rels_authors_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_authors_id_idx";
  ALTER TABLE "articles_rels" DROP COLUMN "authors_id";
  ALTER TABLE "_articles_v_rels" DROP COLUMN "authors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";`)
}
