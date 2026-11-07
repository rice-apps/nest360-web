import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_projects_category"
      AS ENUM('healthcare', 'innovators', 'implementors', 'families', 'dashboards');
    ALTER TABLE "projects"
      ADD COLUMN "category" "public"."enum_projects_category"
      DEFAULT 'healthcare' NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects" DROP COLUMN "category";
    DROP TYPE "public"."enum_projects_category";
  `);
}
