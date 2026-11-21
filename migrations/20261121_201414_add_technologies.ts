import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_technologies_category_of_care" AS ENUM('respiratory', 'thermal', 'hydration', 'jaundice', 'monitoring', 'diagnostics');
  CREATE TABLE "technologies_qualified_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"regulation" varchar,
  	"image_id" integer,
  	"price" varchar,
  	"consumables" varchar,
  	"power_source" varchar,
  	"voltage" varchar,
  	"warranty" varchar,
  	"product_url" varchar
  );
  
  CREATE TABLE "technologies_resource_groups_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"resource_id" integer NOT NULL,
  	"is_new" boolean DEFAULT false
  );
  
  CREATE TABLE "technologies_resource_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "technologies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category_of_care" "enum_technologies_category_of_care" NOT NULL,
  	"featured_image_id" integer,
  	"description" jsonb NOT NULL,
  	"purchase_url" varchar DEFAULT 'https://www.hatch-tech.org/',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "search_rels" ADD COLUMN "technologies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "technologies_id" integer;
  ALTER TABLE "technologies_qualified_products" ADD CONSTRAINT "technologies_qualified_products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "technologies_qualified_products" ADD CONSTRAINT "technologies_qualified_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "technologies_resource_groups_resources" ADD CONSTRAINT "technologies_resource_groups_resources_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "technologies_resource_groups_resources" ADD CONSTRAINT "technologies_resource_groups_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."technologies_resource_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "technologies_resource_groups" ADD CONSTRAINT "technologies_resource_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "technologies" ADD CONSTRAINT "technologies_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "technologies_qualified_products_order_idx" ON "technologies_qualified_products" USING btree ("_order");
  CREATE INDEX "technologies_qualified_products_parent_id_idx" ON "technologies_qualified_products" USING btree ("_parent_id");
  CREATE INDEX "technologies_qualified_products_image_idx" ON "technologies_qualified_products" USING btree ("image_id");
  CREATE INDEX "technologies_resource_groups_resources_order_idx" ON "technologies_resource_groups_resources" USING btree ("_order");
  CREATE INDEX "technologies_resource_groups_resources_parent_id_idx" ON "technologies_resource_groups_resources" USING btree ("_parent_id");
  CREATE INDEX "technologies_resource_groups_resources_resource_idx" ON "technologies_resource_groups_resources" USING btree ("resource_id");
  CREATE INDEX "technologies_resource_groups_order_idx" ON "technologies_resource_groups" USING btree ("_order");
  CREATE INDEX "technologies_resource_groups_parent_id_idx" ON "technologies_resource_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "technologies_slug_idx" ON "technologies" USING btree ("slug");
  CREATE INDEX "technologies_category_of_care_idx" ON "technologies" USING btree ("category_of_care");
  CREATE INDEX "technologies_featured_image_idx" ON "technologies" USING btree ("featured_image_id");
  CREATE INDEX "technologies_updated_at_idx" ON "technologies" USING btree ("updated_at");
  CREATE INDEX "technologies_created_at_idx" ON "technologies" USING btree ("created_at");
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_technologies_fk" FOREIGN KEY ("technologies_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_technologies_fk" FOREIGN KEY ("technologies_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "search_rels_technologies_id_idx" ON "search_rels" USING btree ("technologies_id");
  CREATE INDEX "payload_locked_documents_rels_technologies_id_idx" ON "payload_locked_documents_rels" USING btree ("technologies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Reordered by hand: the generated version dropped the technologies tables first, which (with CASCADE) also
  // drops the foreign keys on search_rels and payload_locked_documents_rels, so dropping those next failed.
  await db.execute(sql`
   ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_technologies_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_technologies_fk";
  DROP INDEX IF EXISTS "search_rels_technologies_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_technologies_id_idx";
  ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "technologies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "technologies_id";
  DROP TABLE "technologies_qualified_products" CASCADE;
  DROP TABLE "technologies_resource_groups_resources" CASCADE;
  DROP TABLE "technologies_resource_groups" CASCADE;
  DROP TABLE "technologies" CASCADE;
  DROP TYPE "public"."enum_technologies_category_of_care";`)
}
