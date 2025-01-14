import type { Client } from "@libsql/client"
import { container } from "@undb/di"
import type Database from "bun:sqlite"
import { drizzle as sqliteDrizzle } from "drizzle-orm/bun-sqlite"
import { migrate as sqliteMigrate } from "drizzle-orm/bun-sqlite/migrator"
import { drizzle as libsqlDrizzle } from "drizzle-orm/libsql"
import { migrate as libsqlMigrate } from "drizzle-orm/libsql/migrator"
import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres"
import { migrate as postgresMigrate } from "drizzle-orm/node-postgres/migrator"
import pg from "pg"
import { DATABASE_CLIENT } from "./db-client"
import { DrizzleLogger } from "./db.logger"
import { DB_PROVIDER } from "./db.provider"

export async function dbMigrate() {
  const dbProvider = container.resolve<string>(DB_PROVIDER)
  if (dbProvider === "sqlite" || !dbProvider) {
    const sqlite = container.resolve<Database>(DATABASE_CLIENT)
    const db = sqliteDrizzle(sqlite, {
      logger: new DrizzleLogger(),
    })

    sqliteMigrate(db, { migrationsFolder: "./drizzle/sqlite" })
    return
  } else if (dbProvider === "postgres") {
    const pg = container.resolve<pg.Pool>(DATABASE_CLIENT)

    const db = postgresDrizzle(pg, {
      logger: new DrizzleLogger(),
    })

    await postgresMigrate(db, { migrationsFolder: "./drizzle/postgres" })
    return
  }

  const sqlite = container.resolve<Client>(DATABASE_CLIENT)
  const db = libsqlDrizzle(sqlite, {
    logger: new DrizzleLogger(),
  })

  await libsqlMigrate(db, { migrationsFolder: "./drizzle/sqlite" })
}
