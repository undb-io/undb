import type { IAuditDetail } from "@undb/audit"
import type { IInvitationStatus, ISpaceMemberRole, ISpaceMemberWithoutOwner } from "@undb/authz"
import type { IDashboardLayouts, IDashboardWidgets } from "@undb/dashboard"
import type { RECORD_EVENTS } from "@undb/table"
import type { IWebhookMethod } from "@undb/webhook"
import { sql } from "drizzle-orm"
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"

const pgTable = pgTableCreator((name) => `undb_${name}`)

export const space = pgTable(
  "space",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    isPersonal: boolean("is_personal").notNull(),
    avatar: text("avatar"),
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
    deletedAt: bigint("deleted_at", { mode: "bigint" }),
    deletedBy: text("deleted_by").references(() => users.id),
  },
  (table) => [index("space_name_idx").on(table.name)],
)

export const tables = pgTable(
  "table",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    baseId: text("base_id")
      .notNull()
      .references(() => baseTable.id),

    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),

    schema: jsonb("schema").notNull(),
    views: jsonb("views").notNull(),
    forms: jsonb("forms"),
    rls: jsonb("rls"),
    widgets: jsonb("widgets"),

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
  },
  (table) => [
    index("table_base_id_idx").on(table.baseId),
    unique("table_name_unique_idx").on(table.name, table.baseId),
    index("table_space_id_idx").on(table.spaceId),
  ],
)

export const tableIdMapping = pgTable(
  "table_id_mapping",
  {
    tableId: text("table_id")
      .notNull()
      .references(() => tables.id),
    subjectId: text("subject_id").notNull(),
  },
  (table) => [primaryKey({ columns: [table.tableId, table.subjectId] })],
)

export const referenceIdMapping = pgTable(
  "reference_id_mapping",
  {
    fieldId: text("field_id").notNull(),
    tableId: text("table_id").notNull(),
    symmetricFieldId: text("symmetric_field_id"),
    foreignTableId: text("foreign_table_id").notNull(),
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

export const rollupIdMapping = pgTable(
  "rollup_id_mapping",
  {
    fieldId: text("field_id").notNull(),
    tableId: text("table_id").notNull(),
    rollupId: text("rollup_id").notNull(),
    rollupTableId: text("rollup_table_id").notNull(),
  },
  (table) => [primaryKey({ columns: [table.fieldId, table.rollupId] })],
)

export const dashboards = pgTable(
  "dashboard",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    baseId: text("base_id")
      .notNull()
      .references(() => baseTable.id),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),

    widgets: jsonb("widgets").$type<IDashboardWidgets>(),
    layout: jsonb("layout").$type<IDashboardLayouts>(),

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
  },
  (table) => [
    index("dashboard_base_id_idx").on(table.baseId),
    unique("dashboard_name_unique_idx").on(table.name, table.baseId),
    index("dashboard_space_id_idx").on(table.spaceId),
  ],
)

export const dashboardTableIdMapping = pgTable(
  "dashboard_table_id_mapping",
  {
    dashboardId: text("dashboard_id")
      .notNull()
      .references(() => dashboards.id),
    tableId: text("table_id")
      .notNull()
      .references(() => tables.id),
  },
  (table) => [primaryKey({ columns: [table.dashboardId, table.tableId] })],
)

export const attachments = pgTable(
  "attachment",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    size: integer("size").notNull(),
    mimeType: text("mime_type").notNull(),
    url: text("url").notNull(),
    token: text("token"),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),
  },
  (table) => [index("attachment_size_idx").on(table.size), index("attachment_space_id_idx").on(table.spaceId)],
)

export const attachmentMapping = pgTable(
  "attachment_mapping",
  {
    attachmentId: text("attachment_id")
      .notNull()
      .references(() => attachments.id),
    tableId: text("table_id")
      .notNull()
      .references(() => tables.id),
    recordId: text("record_id").notNull(),
    fieldId: text("field_id").notNull(),
  },
  (table) => [primaryKey({ columns: [table.attachmentId, table.tableId, table.recordId, table.fieldId] })],
)

export const outbox = pgTable(
  "outbox",
  {
    id: text("id").notNull().primaryKey(),
    payload: jsonb("payload").notNull(),
    meta: jsonb("meta"),
    timestamp: bigint("timestamp", { mode: "bigint" }).notNull(),
    userId: text("user_id"),
    name: text("name").notNull(),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),
  },
  (table) => [index("outbox_space_id_idx").on(table.spaceId)],
)

export const users = pgTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    email_verified: boolean("email_verified").notNull().default(false),
    password: text("password").notNull(),
    avatar: text("avatar"),
    otp_secret: text("otp_secret"),
  },
  (table) => [index("user_username_idx").on(table.username), index("user_email_idx").on(table.email)],
)

export const passwordResetTokenTable = pgTable(
  "password_reset_token",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
  },
  (table) => [index("password_reset_token_user_id_idx").on(table.userId)],
)

export const oauthAccount = pgTable(
  "oauth_account",
  {
    provider_id: text("provider_id").notNull(),
    provider_user_id: text("provider_user_id").notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [primaryKey({ columns: [table.provider_id, table.provider_user_id] })],
)

export const emailVerificationCode = pgTable("email_verification_code", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  code: text("code").notNull(),
  userId: text("user_id")
    .unique()
    .references(() => users.id),
  email: text("email").notNull(),
  expires_at: bigint("expires_at", { mode: "bigint" }).notNull(),
})

export const sessionTable = pgTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
  spaceId: text("space_id")
    .notNull()
    .references(() => space.id),
})

export const webhook = pgTable(
  "webhook",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    method: text("method").notNull().$type<IWebhookMethod>(),
    enabled: boolean("enabled").notNull(),
    tableId: text("table_id")
      .notNull()
      .references(() => tables.id),
    headers: jsonb("headers").notNull(),
    condition: jsonb("condition"),
    event: text("event").notNull().$type<RECORD_EVENTS>(),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),
  },
  (table) => [
    index("webhook_table_id_idx").on(table.tableId),
    index("webhook_space_id_idx").on(table.spaceId),
    index("webhook_url_idx").on(table.url),
  ],
)

export const audit = pgTable(
  "audit",
  {
    id: text("id").notNull().primaryKey(),
    timestamp: bigint("timestamp", { mode: "bigint" }).notNull(),
    detail: jsonb("detail").$type<IAuditDetail>(),
    meta: jsonb("meta"),
    op: text("op").notNull().$type<RECORD_EVENTS>(),
    tableId: text("table_id").notNull(),
    recordId: text("record_id").notNull(),
    operatorId: text("operator_id").notNull(),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),
  },
  (table) => [
    index("audit_table_id_idx").on(table.tableId),
    index("audit_space_id_idx").on(table.spaceId),
    index("audit_record_id_idx").on(table.recordId),
  ],
)

export const spaceMember = pgTable(
  "space_member",
  {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull().$type<ISpaceMemberRole>(),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),
  },
  (table) => [unique("space_member_unique_idx").on(table.userId, table.spaceId)],
)

export const baseTable = pgTable(
  "base",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    spaceId: text("space_id")
      .references(() => space.id)
      .notNull(),
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
  },
  (base) => [unique("base_name_unique_idx").on(base.name, base.spaceId), index("base_space_id_idx").on(base.spaceId)],
)

export const shareTable = pgTable(
  "share",
  {
    id: text("id").notNull().primaryKey(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    enabled: boolean("enabled").notNull(),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id),
  },
  (table) => [
    unique("share_unique_idx").on(table.targetType, table.targetId),
    index("share_space_id_idx").on(table.spaceId),
  ],
)

export const invitations = pgTable(
  "invitation",
  {
    id: text("id").notNull().primaryKey(),
    email: text("email").notNull(),
    role: text("role").notNull().$type<ISpaceMemberWithoutOwner>(),
    status: text("status").notNull().$type<IInvitationStatus>(),
    spaceId: text("space_id")
      .references(() => space.id)
      .notNull(),
    invitedAt: bigint("invited_at", { mode: "bigint" }).notNull(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("invitation_space_id_idx").on(table.spaceId),
    unique("invitation_unique_idx").on(table.email, table.spaceId),
  ],
)

export const apiTokenTable = pgTable(
  "api_token",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    spaceId: text("space_id")
      .references(() => space.id)
      .notNull(),
    token: text("token").notNull().unique(),
  },
  (table) => [index("api_token_space_id_idx").on(table.spaceId), index("api_token_user_id_idx").on(table.userId)],
)
