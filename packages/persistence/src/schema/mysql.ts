import type { IAuditDetail } from "@undb/audit"
import type { IInvitationStatus, ISpaceMemberRole, ISpaceMemberWithoutOwner } from "@undb/authz"
import type { IDashboardLayouts, IDashboardWidgets } from "@undb/dashboard"
import type { RECORD_EVENTS } from "@undb/table"
import type { IWebhookMethod } from "@undb/webhook"
import { sql } from "drizzle-orm"
import {
  bigint,
  boolean,
  foreignKey,
  index,
  int,
  json,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core"

const mysqlTable = mysqlTableCreator((name) => `undb_${name}`)

export const space = mysqlTable(
  "space",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    isPersonal: boolean("is_personal").notNull(),
    avatar: text("avatar"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    createdBy: varchar("created_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    updateAt: text("updated_at")
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
    updatedBy: varchar("updated_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    deletedAt: bigint("deleted_at", { mode: "bigint" }),
    deletedBy: varchar("deleted_by", { length: 36 }).references(() => users.id),
  },
  (table) => [index("space_name_idx").on(table.name)],
)

export const tables = mysqlTable(
  "table",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    baseId: varchar("base_id", { length: 36 })
      .notNull()
      .references(() => baseTable.id),

    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),

    schema: json("schema").notNull(),
    views: json("views").notNull(),
    forms: json("forms"),
    rls: json("rls"),
    widgets: json("widgets"),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    createdBy: varchar("created_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    updateAt: text("updated_at")
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
    updatedBy: varchar("updated_by", { length: 36 })
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("table_base_id_idx").on(table.baseId),
    unique("table_name_unique_idx").on(table.name, table.baseId),
    index("table_space_id_idx").on(table.spaceId),
  ],
)

export const tableIdMapping = mysqlTable(
  "table_id_mapping",
  {
    tableId: varchar("table_id", { length: 36 }).notNull(),
    subjectId: varchar("subject_id", { length: 36 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tableId, table.subjectId] }),
    foreignKey({
      columns: [table.tableId],
      foreignColumns: [tables.id],
      name: "table_id_mapping_table_id_fk",
    }),
  ],
)

export const referenceIdMapping = mysqlTable(
  "reference_id_mapping",
  {
    fieldId: varchar("field_id", { length: 36 }).notNull(),
    tableId: varchar("table_id", { length: 36 }).notNull(),
    symmetricFieldId: varchar("symmetric_field_id", { length: 36 }),
    foreignTableId: varchar("foreign_table_id", { length: 36 }).notNull(),
  },
  (table) => [
    unique("reference_id_mapping_unique_idx").on(
      table.fieldId,
      table.tableId,
      table.symmetricFieldId,
      table.foreignTableId,
    ),
  ],
)

export const rollupIdMapping = mysqlTable(
  "rollup_id_mapping",
  {
    fieldId: varchar("field_id", { length: 36 }).notNull(),
    tableId: varchar("table_id", { length: 36 }).notNull(),
    rollupId: varchar("rollup_id", { length: 36 }).notNull(),
    rollupTableId: varchar("rollup_table_id", { length: 36 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.fieldId, table.rollupId] })],
)

export const dashboards = mysqlTable(
  "dashboard",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    baseId: varchar("base_id", { length: 36 })
      .notNull()
      .references(() => baseTable.id),
    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),

    widgets: json("widgets").$type<IDashboardWidgets>(),
    layout: json("layout").$type<IDashboardLayouts>(),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    createdBy: varchar("created_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    updateAt: text("updated_at")
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
    updatedBy: varchar("updated_by", { length: 36 })
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("dashboard_base_id_idx").on(table.baseId),
    unique("dashboard_name_unique_idx").on(table.name, table.baseId),
    index("dashboard_space_id_idx").on(table.spaceId),
  ],
)

export const dashboardTableIdMapping = mysqlTable(
  "dashboard_table_id_mapping",
  {
    dashboardId: varchar("dashboard_id", { length: 36 }).notNull(),
    tableId: varchar("table_id", { length: 36 }).notNull(),
  },
  (table) => [
    primaryKey({ name: "pk", columns: [table.dashboardId, table.tableId] }),
    foreignKey({
      columns: [table.dashboardId],
      foreignColumns: [dashboards.id],
      name: "dashboard_table_id_mapping_dashboard_id_fk",
    }),
    foreignKey({
      columns: [table.tableId],
      foreignColumns: [tables.id],
      name: "dashboard_table_id_mapping_table_id_fk",
    }),
  ],
)

export const attachments = mysqlTable(
  "attachment",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    size: int("size").notNull(),
    mimeType: varchar("mime_type", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    token: varchar("token", { length: 36 }),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    createdBy: varchar("created_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),
  },
  (table) => [index("attachment_size_idx").on(table.size), index("attachment_space_id_idx").on(table.spaceId)],
)

export const attachmentMapping = mysqlTable(
  "attachment_mapping",
  {
    attachmentId: varchar("attachment_id", { length: 36 })
      .notNull()
      .references(() => attachments.id),
    tableId: varchar("table_id", { length: 36 })
      .notNull()
      .references(() => tables.id),
    recordId: varchar("record_id", { length: 36 }).notNull(),
    fieldId: varchar("field_id", { length: 36 }).notNull(),
  },
  (table) => [primaryKey({ name: "pk", columns: [table.attachmentId, table.tableId, table.recordId, table.fieldId] })],
)

export const outbox = mysqlTable(
  "outbox",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    payload: json("payload").notNull(),
    meta: json("meta"),
    timestamp: bigint("timestamp", { mode: "bigint" }).notNull(),
    userId: varchar("user_id", { length: 36 }),
    name: text("name").notNull(),
    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),
  },
  (table) => [index("outbox_space_id_idx").on(table.spaceId)],
)

export const users = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    email_verified: boolean("email_verified").notNull().default(false),
    password: text("password").notNull(),
    avatar: text("avatar"),
    otp_secret: text("otp_secret"),
  },
  (table) => [index("user_username_idx").on(table.username), index("user_email_idx").on(table.email)],
)

export const passwordResetTokenTable = mysqlTable(
  "password_reset_token",
  {
    id: int("id").autoincrement().primaryKey(),
    token: varchar("token", { length: 36 }).notNull().unique(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
  },
  (table) => [index("password_reset_token_user_id_idx").on(table.userId)],
)

export const oauthAccount = mysqlTable(
  "oauth_account",
  {
    provider_id: varchar("provider_id", { length: 36 }).notNull(),
    provider_user_id: varchar("provider_user_id", { length: 36 }).notNull(),
    user_id: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
  },
  (table) => [primaryKey({ columns: [table.provider_id, table.provider_user_id] })],
)

export const emailVerificationCode = mysqlTable("email_verification_code", {
  id: int("id").autoincrement().primaryKey(),
  code: text("code").notNull(),
  userId: varchar("user_id", { length: 36 })
    .unique()
    .references(() => users.id),
  email: text("email").notNull(),
  expires_at: bigint("expires_at", { mode: "bigint" }).notNull(),
})

export const sessionTable = mysqlTable("session", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  spaceId: varchar("space_id", { length: 36 })
    .notNull()
    .references(() => space.id),
})

export const webhook = mysqlTable(
  "webhook",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: text("name").notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    method: text("method").notNull().$type<IWebhookMethod>(),
    enabled: boolean("enabled").notNull(),
    tableId: varchar("table_id", { length: 36 })
      .notNull()
      .references(() => tables.id),
    headers: json("headers").notNull(),
    condition: json("condition"),
    event: text("event").notNull().$type<RECORD_EVENTS>(),
    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),
  },
  (table) => [
    index("webhook_table_id_idx").on(table.tableId),
    index("webhook_space_id_idx").on(table.spaceId),
    index("webhook_url_idx").on(table.url),
  ],
)

export const audit = mysqlTable(
  "audit",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    timestamp: bigint("timestamp", { mode: "bigint" }).notNull(),
    detail: json("detail").$type<IAuditDetail>(),
    meta: json("meta"),
    op: text("op").notNull().$type<RECORD_EVENTS>(),
    tableId: varchar("table_id", { length: 36 }).notNull(),
    recordId: varchar("record_id", { length: 36 }).notNull(),
    operatorId: varchar("operator_id", { length: 36 }).notNull(),
    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),
  },
  (table) => [
    index("audit_table_id_idx").on(table.tableId),
    index("audit_space_id_idx").on(table.spaceId),
    index("audit_record_id_idx").on(table.recordId),
  ],
)

export const spaceMember = mysqlTable(
  "space_member",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    role: text("role").notNull().$type<ISpaceMemberRole>(),
    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),
  },
  (table) => [unique("space_member_unique_idx").on(table.userId, table.spaceId)],
)

export const baseTable = mysqlTable(
  "base",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    spaceId: varchar("space_id", { length: 36 })
      .references(() => space.id)
      .notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    createdBy: varchar("created_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    updateAt: text("updated_at")
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
    updatedBy: varchar("updated_by", { length: 36 })
      .notNull()
      .references(() => users.id),
  },
  (base) => [unique("base_name_unique_idx").on(base.name, base.spaceId), index("base_space_id_idx").on(base.spaceId)],
)

export const shareTable = mysqlTable(
  "share",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    targetType: varchar("target_type", { length: 255 }).notNull(),
    targetId: varchar("target_id", { length: 36 }).notNull(),
    enabled: boolean("enabled").notNull(),
    spaceId: varchar("space_id", { length: 36 })
      .notNull()
      .references(() => space.id),
  },
  (table) => [
    unique("share_unique_idx").on(table.targetType, table.targetId),
    index("share_space_id_idx").on(table.spaceId),
  ],
)

export const invitations = mysqlTable(
  "invitation",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    role: text("role").notNull().$type<ISpaceMemberWithoutOwner>(),
    status: text("status").notNull().$type<IInvitationStatus>(),
    spaceId: varchar("space_id", { length: 36 })
      .references(() => space.id)
      .notNull(),
    invitedAt: bigint("invited_at", { mode: "bigint" }).notNull(),
    inviterId: varchar("inviter_id", { length: 36 })
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("invitation_space_id_idx").on(table.spaceId),
    unique("invitation_unique_idx").on(table.email, table.spaceId),
  ],
)

export const apiTokenTable = mysqlTable(
  "api_token",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    spaceId: varchar("space_id", { length: 36 })
      .references(() => space.id)
      .notNull(),
    token: varchar("token", { length: 36 }).notNull().unique(),
  },
  (table) => [index("api_token_space_id_idx").on(table.spaceId), index("api_token_user_id_idx").on(table.userId)],
)
