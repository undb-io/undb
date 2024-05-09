import { Database as SqliteDatabase } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { DrizzleLogger } from './db.logger'

export const sqlite = new SqliteDatabase('./.undb/undb.db')

export const db = drizzle(sqlite, {
  logger: new DrizzleLogger(),
})

migrate(db, { migrationsFolder: './drizzle' })

export type Database = typeof db
