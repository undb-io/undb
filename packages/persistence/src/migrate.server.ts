import type { Client } from "@libsql/client"
import { container } from "@undb/di"
import type Database from "bun:sqlite"
import { drizzle as sqliteDrizzle } from "drizzle-orm/bun-sqlite"
import { migrate as sqliteMigrate } from "drizzle-orm/bun-sqlite/migrator"
import { drizzle as libsqlDrizzle } from "drizzle-orm/libsql"
import { migrate as libsqlMigrate } from "drizzle-orm/libsql/migrator"
import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2"
import { migrate as mysqlMigrate } from "drizzle-orm/mysql2/migrator"
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js"
import { migrate as postgresMigrate } from "drizzle-orm/postgres-js/migrator"
import mysql from "mysql2/promise"
import postgres from "postgres"
import { DATABASE_CLIENT } from "./db-client"
import { DrizzleLogger } from "./db.logger"
import { DB_PROVIDER } from "./db.provider"

export async function dbMigrate() {
  const dbProvider = container.resolve<string>(DB_PROVIDER)
  const logger = new DrizzleLogger()

  if (dbProvider === "sqlite" || !dbProvider) {
    const sqlite = container.resolve<Database>(DATABASE_CLIENT)
    const db = sqliteDrizzle(sqlite, {
      logger,
    })

    sqliteMigrate(db, { migrationsFolder: "./drizzle/sqlite" })
    return
  } else if (dbProvider === "postgres") {
    const pg = container.resolve<postgres.Sql>(DATABASE_CLIENT)

    const db = postgresDrizzle(pg, {
      logger,
    })

    await postgresMigrate(db, { migrationsFolder: "./drizzle/postgres" })
    return
  } else if (dbProvider === "mysql") {
    const mysql = container.resolve<mysql.Pool>(DATABASE_CLIENT)
    const db = mysqlDrizzle(mysql, {
      logger,
    })

    await mysqlMigrate(db, { migrationsFolder: "./drizzle/mysql" })
    return
  }

  const sqlite = container.resolve<Client>(DATABASE_CLIENT)
  const db = libsqlDrizzle(sqlite, {
    logger,
  })

  await libsqlMigrate(db, { migrationsFolder: "./drizzle/sqlite" })
}
