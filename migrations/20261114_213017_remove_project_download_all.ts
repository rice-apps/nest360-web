import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP CONSTRAINT "projects_download_all_id_documents_id_fk";
  
  DROP INDEX "projects_download_all_idx";
  ALTER TABLE "projects" DROP COLUMN "download_all_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "download_all_id" integer;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_download_all_id_documents_id_fk" FOREIGN KEY ("download_all_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_download_all_idx" ON "projects" USING btree ("download_all_id");`)
}
