import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tags_used_for" AS ENUM('pages', 'files', 'both');
  CREATE TYPE "public"."enum_projects_files_kind" AS ENUM('file', 'video', 'link');
  CREATE TYPE "public"."enum_projects_files_language" AS ENUM('en', 'fr', 'pt', 'sw');
  CREATE TYPE "public"."enum_projects_file_groups_files_kind" AS ENUM('file', 'video', 'link');
  CREATE TYPE "public"."enum_projects_file_groups_files_language" AS ENUM('en', 'fr', 'pt', 'sw');
  CREATE TYPE "public"."enum_projects_layout" AS ENUM('list', 'groups');
  CREATE TABLE "articles_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"documents_id" integer
  );
  
  CREATE TABLE "_articles_v_version_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"documents_id" integer
  );
  
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
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"featured_image_id" integer,
  	"description" jsonb NOT NULL,
  	"tag_id" integer NOT NULL,
  	"layout" "enum_projects_layout" DEFAULT 'list' NOT NULL,
  	"download_all_id" integer,
  	"citation" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"projects_id" integer
  );
  
  ALTER TABLE "documents" ADD COLUMN "preview_id" integer;
  ALTER TABLE "tags" ADD COLUMN "used_for" "enum_tags_used_for" DEFAULT 'pages' NOT NULL;
  ALTER TABLE "articles" ADD COLUMN "published_date" timestamp(3) with time zone;
  ALTER TABLE "articles" ADD COLUMN "featured_image_id" integer;
  ALTER TABLE "articles" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "articles" ADD COLUMN "content" jsonb;
  ALTER TABLE "articles" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_published_date" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "version_featured_image_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "articles_authors" ADD CONSTRAINT "articles_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_authors" ADD CONSTRAINT "_articles_v_version_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_files" ADD CONSTRAINT "projects_files_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_files" ADD CONSTRAINT "projects_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_file_groups_files" ADD CONSTRAINT "projects_file_groups_files_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_file_groups_files" ADD CONSTRAINT "projects_file_groups_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_file_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_file_groups" ADD CONSTRAINT "projects_file_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_download_all_id_documents_id_fk" FOREIGN KEY ("download_all_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_authors_order_idx" ON "articles_authors" USING btree ("_order");
  CREATE INDEX "articles_authors_parent_id_idx" ON "articles_authors" USING btree ("_parent_id");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_tags_id_idx" ON "articles_rels" USING btree ("tags_id");
  CREATE INDEX "articles_rels_documents_id_idx" ON "articles_rels" USING btree ("documents_id");
  CREATE INDEX "_articles_v_version_authors_order_idx" ON "_articles_v_version_authors" USING btree ("_order");
  CREATE INDEX "_articles_v_version_authors_parent_id_idx" ON "_articles_v_version_authors" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_tags_id_idx" ON "_articles_v_rels" USING btree ("tags_id");
  CREATE INDEX "_articles_v_rels_documents_id_idx" ON "_articles_v_rels" USING btree ("documents_id");
  CREATE INDEX "projects_files_order_idx" ON "projects_files" USING btree ("_order");
  CREATE INDEX "projects_files_parent_id_idx" ON "projects_files" USING btree ("_parent_id");
  CREATE INDEX "projects_files_file_idx" ON "projects_files" USING btree ("file_id");
  CREATE INDEX "projects_file_groups_files_order_idx" ON "projects_file_groups_files" USING btree ("_order");
  CREATE INDEX "projects_file_groups_files_parent_id_idx" ON "projects_file_groups_files" USING btree ("_parent_id");
  CREATE INDEX "projects_file_groups_files_file_idx" ON "projects_file_groups_files" USING btree ("file_id");
  CREATE INDEX "projects_file_groups_order_idx" ON "projects_file_groups" USING btree ("_order");
  CREATE INDEX "projects_file_groups_parent_id_idx" ON "projects_file_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");
  CREATE INDEX "projects_tag_idx" ON "projects" USING btree ("tag_id");
  CREATE INDEX "projects_download_all_idx" ON "projects" USING btree ("download_all_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_tags_id_idx" ON "projects_rels" USING btree ("tags_id");
  CREATE INDEX "projects_rels_projects_id_idx" ON "projects_rels" USING btree ("projects_id");
  ALTER TABLE "documents" ADD CONSTRAINT "documents_preview_id_media_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "documents_preview_idx" ON "documents" USING btree ("preview_id");
  CREATE INDEX "articles_featured_image_idx" ON "articles" USING btree ("featured_image_id");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
  CREATE INDEX "_articles_v_version_version_featured_image_idx" ON "_articles_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v" USING btree ("version_meta_image_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  ALTER TABLE "documents" DROP COLUMN "title";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_file_groups_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_file_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "articles_authors" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_version_authors" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "projects_files" CASCADE;
  DROP TABLE "projects_file_groups_files" CASCADE;
  DROP TABLE "projects_file_groups" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  ALTER TABLE "documents" DROP CONSTRAINT "documents_preview_id_media_id_fk";
  
  ALTER TABLE "articles" DROP CONSTRAINT "articles_featured_image_id_media_id_fk";
  
  ALTER TABLE "articles" DROP CONSTRAINT "articles_meta_image_id_media_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_featured_image_id_media_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "documents_preview_idx";
  DROP INDEX "articles_featured_image_idx";
  DROP INDEX "articles_meta_meta_image_idx";
  DROP INDEX "_articles_v_version_version_featured_image_idx";
  DROP INDEX "_articles_v_version_meta_version_meta_image_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "documents" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "documents" DROP COLUMN "preview_id";
  ALTER TABLE "tags" DROP COLUMN "used_for";
  ALTER TABLE "articles" DROP COLUMN "published_date";
  ALTER TABLE "articles" DROP COLUMN "featured_image_id";
  ALTER TABLE "articles" DROP COLUMN "excerpt";
  ALTER TABLE "articles" DROP COLUMN "content";
  ALTER TABLE "articles" DROP COLUMN "meta_title";
  ALTER TABLE "articles" DROP COLUMN "meta_description";
  ALTER TABLE "articles" DROP COLUMN "meta_image_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_published_date";
  ALTER TABLE "_articles_v" DROP COLUMN "version_featured_image_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "_articles_v" DROP COLUMN "version_content";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_tags_used_for";
  DROP TYPE "public"."enum_projects_files_kind";
  DROP TYPE "public"."enum_projects_files_language";
  DROP TYPE "public"."enum_projects_file_groups_files_kind";
  DROP TYPE "public"."enum_projects_file_groups_files_language";
  DROP TYPE "public"."enum_projects_layout";`)
}
