import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Footer redesign: optional logo and Donate button, optional column titles, social media text,
// email text and copyright. Payload also generated "header"."donate_color"; it is left out because
// 20261114_213925_donate_color already adds it (the previous snapshot was taken without that migration).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_columns" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "logo_id" integer;
  ALTER TABLE "footer" ADD COLUMN "donate_label" varchar DEFAULT 'Donate';
  ALTER TABLE "footer" ADD COLUMN "donate_url" varchar;
  ALTER TABLE "footer" ADD COLUMN "donate_color" varchar;
  ALTER TABLE "footer" ADD COLUMN "socials_heading" varchar DEFAULT 'Join the conversation, and follow us on social media!';
  ALTER TABLE "footer" ADD COLUMN "contact_label" varchar DEFAULT 'Questions? Email us at';
  ALTER TABLE "footer" ADD COLUMN "copyright" varchar DEFAULT '© NEST360. All rights reserved.';
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP CONSTRAINT "footer_logo_id_media_id_fk";
  
  DROP INDEX "footer_logo_idx";
  ALTER TABLE "footer_columns" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "footer" DROP COLUMN "logo_id";
  ALTER TABLE "footer" DROP COLUMN "donate_label";
  ALTER TABLE "footer" DROP COLUMN "donate_url";
  ALTER TABLE "footer" DROP COLUMN "donate_color";
  ALTER TABLE "footer" DROP COLUMN "socials_heading";
  ALTER TABLE "footer" DROP COLUMN "contact_label";
  ALTER TABLE "footer" DROP COLUMN "copyright";`)
}
