import { createClient } from "@libsql/client"
import type { Kyselify } from "drizzle-orm/kysely"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import type { Insertable, Selectable } from "kysely"
import { DrizzleLogger } from "./db.logger"
import type { baseTable, tableIdMapping, tables } from "./tables"

export const sqlite = createClient({
  url: "http://127.0.0.1:8080",
})

export const db = drizzle(sqlite, {
  logger: new DrizzleLogger(),
})

await migrate(db, { migrationsFolder: "./drizzle" })

export type Database = typeof db

type TableTable = Kyselify<typeof tables>
type TableIdMappingTable = Kyselify<typeof tableIdMapping>
type BaseTable = Kyselify<typeof baseTable>

export interface Database2 {
  undb_table: TableTable
  undb_base: BaseTable
  undb_table_id_mapping: TableIdMappingTable
}

export type Table = Selectable<TableTable>
export type Base = Selectable<BaseTable>

export type InsertTableIdMapping = Insertable<TableIdMappingTable>
