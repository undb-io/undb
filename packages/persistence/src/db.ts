import type { Kyselify } from "drizzle-orm/kysely"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import type { Insertable, Selectable } from "kysely"
import { sqlite } from "./client"
import { DrizzleLogger } from "./db.logger"
import type {
  apiTokenTable,
  audit,
  baseTable,
  invitations,
  outbox,
  referenceIdMapping,
  rollupIdMapping,
  shareTable,
  space,
  spaceMember,
  tableIdMapping,
  tables,
  users,
  webhook,
} from "./tables"

export const db = drizzle(sqlite, {
  logger: new DrizzleLogger(),
})

await migrate(db, { migrationsFolder: "./drizzle" })

type SpaceTable = Kyselify<typeof space>
type TableTable = Kyselify<typeof tables>
type TableIdMappingTable = Kyselify<typeof tableIdMapping>
type RollupIdMappingTable = Kyselify<typeof rollupIdMapping>
type AuditTable = Kyselify<typeof audit>
type BaseTable = Kyselify<typeof baseTable>
type OutboxTable = Kyselify<typeof outbox>
type ShareTable = Kyselify<typeof shareTable>
type WebhookTable = Kyselify<typeof webhook>
type UserTable = Kyselify<typeof users>
type SpaceMemberTable = Kyselify<typeof spaceMember>
type InvitationTable = Kyselify<typeof invitations>
type ReferenceIdMappingTable = Kyselify<typeof referenceIdMapping>
type ApiTokenTable = Kyselify<typeof apiTokenTable>

export interface Database {
  undb_space: SpaceTable
  undb_base: BaseTable
  undb_table: TableTable
  undb_audit: AuditTable
  undb_table_id_mapping: TableIdMappingTable
  undb_rollup_id_mapping: RollupIdMappingTable
  undb_outbox: OutboxTable
  undb_share: ShareTable
  undb_webhook: WebhookTable
  undb_user: UserTable
  undb_space_member: SpaceMemberTable
  undb_invitation: InvitationTable
  undb_reference_id_mapping: ReferenceIdMappingTable
  undb_api_token: ApiTokenTable
}

export type Space = Selectable<SpaceTable>
export type Table = Selectable<TableTable>
export type InsertTable = Insertable<TableTable>
export type Base = Selectable<BaseTable>
export type Audit = Selectable<AuditTable>
export type InsertAudit = Insertable<AuditTable>
export type Outbox = Selectable<OutboxTable>
export type InsertOutbox = Insertable<OutboxTable>
export type Share = Selectable<ShareTable>
export type Webhook = Selectable<WebhookTable>
export type InsertWebhook = Insertable<WebhookTable>
export type User = Selectable<UserTable>
export type SpaceMember = Selectable<SpaceMemberTable>
export type Invitation = Selectable<InvitationTable>
export type ApiToken = Selectable<ApiTokenTable>

export type InsertTableIdMapping = Insertable<TableIdMappingTable>
export type InsertRollupIdMapping = Insertable<RollupIdMappingTable>
export type InsertReferenceIdMapping = Insertable<ReferenceIdMappingTable>
