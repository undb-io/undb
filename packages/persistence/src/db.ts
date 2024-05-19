import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { Database as SqliteDatabase } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { DrizzleLogger } from "./db.logger"
import { sessionTable, userTable } from "./tables"

export const sqlite = new SqliteDatabase("./.undb/undb.db")

export const db = drizzle(sqlite, {
  logger: new DrizzleLogger(),
})

migrate(db, { migrationsFolder: "./drizzle" })

export type Database = typeof db

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)
