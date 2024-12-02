import type { Client } from "@libsql/client"
import { container } from "@undb/di"
import { env } from "@undb/env"
import type Database from "bun:sqlite"
import { drizzle as sqliteDrizzle } from "drizzle-orm/bun-sqlite"
import { migrate as sqliteMigrate } from "drizzle-orm/bun-sqlite/migrator"
import { drizzle as libsqlDrizzle } from "drizzle-orm/libsql"
import { migrate as libsqlMigrate } from "drizzle-orm/libsql/migrator"
import { SQLITE_CLIENT } from "./db-client"
import { DrizzleLogger } from "./db.logger"

export async function dbMigrate() {
  if (env.UNDB_DB_PROVIDER === "sqlite" || !env.UNDB_DB_PROVIDER) {
    const sqlite = container.resolve<Database>(SQLITE_CLIENT)
    const db = sqliteDrizzle(sqlite, {
      logger: new DrizzleLogger(),
    })

    sqliteMigrate(db, { migrationsFolder: "./drizzle" })
    return
  }

  const sqlite = container.resolve<Client>(SQLITE_CLIENT)
  const db = libsqlDrizzle(sqlite, {
    logger: new DrizzleLogger(),
  })

  await libsqlMigrate(db, { migrationsFolder: "./drizzle" })
}
