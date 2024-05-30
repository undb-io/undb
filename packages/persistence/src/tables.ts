import type { IFormsDTO, ISchemaDTO, IViewsDTO } from "@undb/table"
import type { IWebhookEventSchema, IWebhookHeaders, IWebhookMethod, IWebhookTarget } from "@undb/webhook"
import type { IRootWebhookCondition } from "@undb/webhook/src/webhook.condition"
import { sql } from "drizzle-orm"
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core"

const sqliteTable = sqliteTableCreator((name) => `undb_${name}`)

export const tables = sqliteTable("table", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  schema: text("schema", { mode: "json" }).$type<ISchemaDTO>(),
  views: text("views", { mode: "json" }).$type<IViewsDTO>(),
  forms: text("forms", { mode: "json" }).$type<IFormsDTO>(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  updateAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  updatedBy: text("updated_by")
    .notNull()
    .references(() => users.id),
})

export type Table = typeof tables.$inferSelect
export type NewTable = typeof tables.$inferInsert

export const outbox = sqliteTable("outbox", {
  id: text("id").notNull().primaryKey(),
  payload: text("payload", { mode: "json" }).notNull(),
  meta: text("meta", { mode: "json" }),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull(),
  operatorId: text("operator_id").notNull(),
  name: text("name").notNull(),
})

export type Outbox = typeof outbox.$inferSelect
export type NewOutbox = typeof outbox.$inferInsert

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
})

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
})

export const webhook = sqliteTable("webhook", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  method: text("method").notNull().$type<IWebhookMethod>(),
  enabled: integer("enabled", { mode: "boolean" }).notNull(),
  target: text("target", { mode: "json" }).$type<IWebhookTarget>(),
  headers: text("headers", { mode: "json" }).notNull().$type<IWebhookHeaders>(),
  condition: text("condition", { mode: "json" }).$type<IRootWebhookCondition>(),
  event: text("event", { mode: "json" }).$type<IWebhookEventSchema>(),
})

export type Webhook = typeof webhook.$inferSelect
export type NewWebhook = typeof webhook.$inferInsert
