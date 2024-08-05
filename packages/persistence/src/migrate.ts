import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import { sqlite } from "./client"
import { DrizzleLogger } from "./db.logger"

export async function dbMigrate() {
  const db = drizzle(sqlite, {
    logger: new DrizzleLogger(),
  })

  await migrate(db, { migrationsFolder: "./drizzle" })
}
