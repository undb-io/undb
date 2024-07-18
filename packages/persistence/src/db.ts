import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import { DrizzleLogger } from "./db.logger"

export const sqlite = createClient({
  url: "http://127.0.0.1:8080",
})

export const db = drizzle(sqlite, {
  logger: new DrizzleLogger(),
})

await migrate(db, { migrationsFolder: "./drizzle" })

export type Database = typeof db
