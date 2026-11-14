import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_users_role" AS ENUM ('pending', 'editor', 'admin');
    ALTER TABLE "users" ADD COLUMN "name" varchar;
    ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'pending' NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN "role";
    ALTER TABLE "users" DROP COLUMN "name";
    DROP TYPE "public"."enum_users_role";
  `)
}
