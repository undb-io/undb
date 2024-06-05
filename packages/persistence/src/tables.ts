import type { IAuditDetail } from "@undb/audit"
import type { IFormsDTO, IRLSGroupDTO, ISchemaDTO, IViewsDTO, RECORD_EVENTS } from "@undb/table"
import type { IWebhookHeaders, IWebhookMethod } from "@undb/webhook"
import type { IRootWebhookCondition } from "@undb/webhook/src/webhook.condition"
import { sql } from "drizzle-orm"
import { index, integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core"

const sqliteTable = sqliteTableCreator((name) => `undb_${name}`)

export const tables = sqliteTable("table", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  schema: text("schema", { mode: "json" }).$type<ISchemaDTO>(),
  views: text("views", { mode: "json" }).$type<IViewsDTO>(),
  forms: text("forms", { mode: "json" }).$type<IFormsDTO>(),
  rls: text("rls", { mode: "json" }).$type<IRLSGroupDTO>(),

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

export const users = sqliteTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    username: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
  },
  (table) => {
    return {
      usernameIdx: index("user_username_idx").on(table.username),
      emailIdx: index("user_email_idx").on(table.email),
    }
  },
)

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
})

export const webhook = sqliteTable(
  "webhook",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    method: text("method").notNull().$type<IWebhookMethod>(),
    enabled: integer("enabled", { mode: "boolean" }).notNull(),
    tableId: text("tableId")
      .notNull()
      .references(() => tables.id),
    headers: text("headers", { mode: "json" }).notNull().$type<IWebhookHeaders>(),
    condition: text("condition", { mode: "json" }).$type<IRootWebhookCondition>(),
    event: text("event").notNull().$type<RECORD_EVENTS>(),
  },
  (table) => {
    return {
      tableIdIdx: index("webhook_table_id_idx").on(table.tableId),
      urlIdx: index("webhook_url_idx").on(table.url),
    }
  },
)

export type Webhook = typeof webhook.$inferSelect
export type NewWebhook = typeof webhook.$inferInsert

export const audit = sqliteTable(
  "audit",
  {
    id: text("id").notNull().primaryKey(),
    timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull(),
    detail: text("detail", { mode: "json" }).$type<IAuditDetail>(),
    op: text("op").notNull().$type<RECORD_EVENTS>(),
    tableId: text("table_id").notNull(),
    recordId: text("record_id").notNull(),
    operatorId: text("operator_id").notNull(),
  },
  (table) => {
    return {
      tableIdIdx: index("audit_table_id_idx").on(table.tableId),
      recordIdIdx: index("audit_record_id_idx").on(table.recordId),
    }
  },
)

export type Audit = typeof audit.$inferSelect
export type NewAudit = typeof audit.$inferInsert
