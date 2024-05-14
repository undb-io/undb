import type { ISchemaDTO } from "@undb/table"
import type { IViewsDTO } from "@undb/table/src/modules/views/dto"
import { sql } from "drizzle-orm"
import { sqliteTableCreator, text } from "drizzle-orm/sqlite-core"

const sqliteTable = sqliteTableCreator((name) => `undb_${name}`)

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
})

export const tables = sqliteTable("table", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  schema: text("schema", { mode: "json" }).$type<ISchemaDTO>(),
  views: text("views", { mode: "json" }).$type<IViewsDTO>(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updateAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type Table = typeof tables.$inferSelect
export type NewTable = typeof tables.$inferInsert
