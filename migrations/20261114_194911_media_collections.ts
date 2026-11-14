import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_documents_document_type" AS ENUM('clinical-aid', 'report', 'template', 'other');
  CREATE TABLE "icons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "documents" ADD COLUMN "document_type" "enum_documents_document_type" DEFAULT 'other';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "icons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "videos_id" integer;
  CREATE INDEX "icons_updated_at_idx" ON "icons" USING btree ("updated_at");
  CREATE INDEX "icons_created_at_idx" ON "icons" USING btree ("created_at");
  CREATE UNIQUE INDEX "icons_filename_idx" ON "icons" USING btree ("filename");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_filename_idx" ON "videos" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_icons_fk" FOREIGN KEY ("icons_id") REFERENCES "public"."icons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "documents_document_type_idx" ON "documents" USING btree ("document_type");
  CREATE INDEX "payload_locked_documents_rels_icons_id_idx" ON "payload_locked_documents_rels" USING btree ("icons_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // IF EXISTS added by hand: DROP TABLE ... CASCADE already removes the foreign keys below.
  await db.execute(sql`
   ALTER TABLE "icons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "icons" CASCADE;
  DROP TABLE "videos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_icons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_videos_fk";
  
  DROP INDEX "documents_document_type_idx";
  DROP INDEX "payload_locked_documents_rels_icons_id_idx";
  DROP INDEX "payload_locked_documents_rels_videos_id_idx";
  ALTER TABLE "documents" DROP COLUMN "document_type";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "icons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "videos_id";
  DROP TYPE "public"."enum_documents_document_type";`)
}
