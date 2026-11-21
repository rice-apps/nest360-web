import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "_pages_v_version_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "intro" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_intro" jsonb;
  ALTER TABLE "pages_countries" ADD CONSTRAINT "pages_countries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_countries" ADD CONSTRAINT "pages_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_countries" ADD CONSTRAINT "_pages_v_version_countries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_countries" ADD CONSTRAINT "_pages_v_version_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_countries_order_idx" ON "pages_countries" USING btree ("_order");
  CREATE INDEX "pages_countries_parent_id_idx" ON "pages_countries" USING btree ("_parent_id");
  CREATE INDEX "pages_countries_image_idx" ON "pages_countries" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_countries_order_idx" ON "_pages_v_version_countries" USING btree ("_order");
  CREATE INDEX "_pages_v_version_countries_parent_id_idx" ON "_pages_v_version_countries" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_countries_image_idx" ON "_pages_v_version_countries" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_countries" CASCADE;
  DROP TABLE "_pages_v_version_countries" CASCADE;
  ALTER TABLE "pages" DROP COLUMN "intro";
  ALTER TABLE "_pages_v" DROP COLUMN "version_intro";`)
}
