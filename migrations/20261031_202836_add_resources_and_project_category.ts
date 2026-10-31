import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resources_resource_type" AS ENUM('document', 'video', 'link', 'publication');
  CREATE TYPE "public"."enum_resources_language" AS ENUM('en', 'fr', 'pt', 'sw');
  CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resources_v_version_resource_type" AS ENUM('document', 'video', 'link', 'publication');
  CREATE TYPE "public"."enum__resources_v_version_language" AS ENUM('en', 'fr', 'pt', 'sw');
  CREATE TYPE "public"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_category" AS ENUM('healthcare', 'innovators', 'implementors', 'families', 'dashboards');
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"resource_type" "enum_resources_resource_type" DEFAULT 'document',
  	"document_id" integer,
  	"video_url" varchar,
  	"external_url" varchar,
  	"thumbnail_id" integer,
  	"language" "enum_resources_language" DEFAULT 'en',
  	"is_new" boolean DEFAULT false,
  	"authors" varchar,
  	"journal_or_publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"doi" varchar,
  	"citation" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_resource_type" "enum__resources_v_version_resource_type" DEFAULT 'document',
  	"version_document_id" integer,
  	"version_video_url" varchar,
  	"version_external_url" varchar,
  	"version_thumbnail_id" integer,
  	"version_language" "enum__resources_v_version_language" DEFAULT 'en',
  	"version_is_new" boolean DEFAULT false,
  	"version_authors" varchar,
  	"version_journal_or_publisher" varchar,
  	"version_publication_date" timestamp(3) with time zone,
  	"version_doi" varchar,
  	"version_citation" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_resources_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "projects_resource_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  ALTER TABLE "projects_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_file_groups_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_file_groups" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_files" CASCADE;
  DROP TABLE "projects_file_groups_files" CASCADE;
  DROP TABLE "projects_file_groups" CASCADE;
  ALTER TABLE "projects_rels" DROP CONSTRAINT "projects_rels_tags_fk";
  
  DROP INDEX "projects_rels_tags_id_idx";
  ALTER TABLE "projects" ADD COLUMN "category" "enum_projects_category" DEFAULT 'healthcare' NOT NULL;
  ALTER TABLE "projects_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_document_id_documents_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_resource_groups" ADD CONSTRAINT "projects_resource_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "resources_title_idx" ON "resources" USING btree ("title");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_resource_type_idx" ON "resources" USING btree ("resource_type");
  CREATE INDEX "resources_document_idx" ON "resources" USING btree ("document_id");
  CREATE INDEX "resources_thumbnail_idx" ON "resources" USING btree ("thumbnail_id");
  CREATE INDEX "resources_language_idx" ON "resources" USING btree ("language");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "resources" USING btree ("_status");
  CREATE INDEX "resources_rels_order_idx" ON "resources_rels" USING btree ("order");
  CREATE INDEX "resources_rels_parent_idx" ON "resources_rels" USING btree ("parent_id");
  CREATE INDEX "resources_rels_path_idx" ON "resources_rels" USING btree ("path");
  CREATE INDEX "resources_rels_tags_id_idx" ON "resources_rels" USING btree ("tags_id");
  CREATE INDEX "_resources_v_parent_idx" ON "_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_title_idx" ON "_resources_v" USING btree ("version_title");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_resource_type_idx" ON "_resources_v" USING btree ("version_resource_type");
  CREATE INDEX "_resources_v_version_version_document_idx" ON "_resources_v" USING btree ("version_document_id");
  CREATE INDEX "_resources_v_version_version_thumbnail_idx" ON "_resources_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_resources_v_version_version_language_idx" ON "_resources_v" USING btree ("version_language");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_latest_idx" ON "_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_rels_order_idx" ON "_resources_v_rels" USING btree ("order");
  CREATE INDEX "_resources_v_rels_parent_idx" ON "_resources_v_rels" USING btree ("parent_id");
  CREATE INDEX "_resources_v_rels_path_idx" ON "_resources_v_rels" USING btree ("path");
  CREATE INDEX "_resources_v_rels_tags_id_idx" ON "_resources_v_rels" USING btree ("tags_id");
  CREATE INDEX "projects_resource_groups_order_idx" ON "projects_resource_groups" USING btree ("_order");
  CREATE INDEX "projects_resource_groups_parent_id_idx" ON "projects_resource_groups" USING btree ("_parent_id");
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_rels_resources_id_idx" ON "projects_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  ALTER TABLE "projects_rels" DROP COLUMN "tags_id";
  DROP TYPE "public"."enum_projects_files_kind";
  DROP TYPE "public"."enum_projects_files_language";
  DROP TYPE "public"."enum_projects_file_groups_files_kind";
  DROP TYPE "public"."enum_projects_file_groups_files_language";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_files_kind" AS ENUM('file', 'video', 'link');
  CREATE TYPE "public"."enum_projects_files_language" AS ENUM('en', 'fr', 'pt', 'sw');
  CREATE TYPE "public"."enum_projects_file_groups_files_kind" AS ENUM('file', 'video', 'link');
  CREATE TYPE "public"."enum_projects_file_groups_files_language" AS ENUM('en', 'fr', 'pt', 'sw');
  CREATE TABLE "projects_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"kind" "enum_projects_files_kind" DEFAULT 'file',
  	"file_id" integer,
  	"video_url" varchar,
  	"url" varchar,
  	"language" "enum_projects_files_language" DEFAULT 'en',
  	"is_new" boolean DEFAULT false
  );
  
  CREATE TABLE "projects_file_groups_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"kind" "enum_projects_file_groups_files_kind" DEFAULT 'file',
  	"file_id" integer,
  	"video_url" varchar,
  	"url" varchar,
  	"language" "enum_projects_file_groups_files_language" DEFAULT 'en',
  	"is_new" boolean DEFAULT false
  );
  
  CREATE TABLE "projects_file_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_resource_groups" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_rels" CASCADE;
  DROP TABLE "_resources_v" CASCADE;
  DROP TABLE "_resources_v_rels" CASCADE;
  DROP TABLE "projects_resource_groups" CASCADE;
  ALTER TABLE "projects_rels" DROP CONSTRAINT "projects_rels_resources_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resources_fk";
  
  DROP INDEX "projects_rels_resources_id_idx";
  DROP INDEX "payload_locked_documents_rels_resources_id_idx";
  ALTER TABLE "projects_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "projects_files" ADD CONSTRAINT "projects_files_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_files" ADD CONSTRAINT "projects_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_file_groups_files" ADD CONSTRAINT "projects_file_groups_files_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_file_groups_files" ADD CONSTRAINT "projects_file_groups_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_file_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_file_groups" ADD CONSTRAINT "projects_file_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_files_order_idx" ON "projects_files" USING btree ("_order");
  CREATE INDEX "projects_files_parent_id_idx" ON "projects_files" USING btree ("_parent_id");
  CREATE INDEX "projects_files_file_idx" ON "projects_files" USING btree ("file_id");
  CREATE INDEX "projects_file_groups_files_order_idx" ON "projects_file_groups_files" USING btree ("_order");
  CREATE INDEX "projects_file_groups_files_parent_id_idx" ON "projects_file_groups_files" USING btree ("_parent_id");
  CREATE INDEX "projects_file_groups_files_file_idx" ON "projects_file_groups_files" USING btree ("file_id");
  CREATE INDEX "projects_file_groups_order_idx" ON "projects_file_groups" USING btree ("_order");
  CREATE INDEX "projects_file_groups_parent_id_idx" ON "projects_file_groups" USING btree ("_parent_id");
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_rels_tags_id_idx" ON "projects_rels" USING btree ("tags_id");
  ALTER TABLE "projects" DROP COLUMN "category";
  ALTER TABLE "projects_rels" DROP COLUMN "resources_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resources_id";
  DROP TYPE "public"."enum_resources_resource_type";
  DROP TYPE "public"."enum_resources_language";
  DROP TYPE "public"."enum_resources_status";
  DROP TYPE "public"."enum__resources_v_version_resource_type";
  DROP TYPE "public"."enum__resources_v_version_language";
  DROP TYPE "public"."enum__resources_v_version_status";
  DROP TYPE "public"."enum_projects_category";`)
}
