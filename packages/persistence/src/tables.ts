import type { ISchemaDTO, IViewsDTO } from "@undb/table"
import { sql } from "drizzle-orm"
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core"

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

export const outbox = sqliteTable("outbox", {
  id: text("id").notNull().primaryKey(),
  payload: text("payload", { mode: "json" }).notNull(),
  meta: text("meta", { mode: "json" }),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  operatorId: text("operator_id").notNull(),
  name: text("name").notNull(),
})

export type Outbox = typeof outbox.$inferSelect
export type NewOutbox = typeof outbox.$inferInsert
