import type { Kyselify } from "drizzle-orm/kysely"
import type { Insertable, Selectable } from "kysely"
import type {
  apiTokenTable,
  attachmentMapping,
  attachments,
  audit,
  baseTable,
  dashboards,
  dashboardTableIdMapping,
  emailVerificationCode,
  invitations,
  oauthAccount,
  outbox,
  passwordResetTokenTable,
  referenceIdMapping,
  rollupIdMapping,
  shareTable,
  space,
  spaceMember,
  tableIdMapping,
  tables,
  users,
  webhook,
} from "./schema/sqlite"

type SpaceTable = Kyselify<typeof space>
type TableTable = Kyselify<typeof tables>
type DashboardTable = Kyselify<typeof dashboards>
type DashboardTableIdMapping = Kyselify<typeof dashboardTableIdMapping>
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
type AttachmentsTable = Kyselify<typeof attachments>
type AttachmentMappingTable = Kyselify<typeof attachmentMapping>
type ApiTokenTable = Kyselify<typeof apiTokenTable>
type EmailVerificationCodeTable = Kyselify<typeof emailVerificationCode>
type OAuthAccountTable = Kyselify<typeof oauthAccount>
type PasswordResetTokenTable = Kyselify<typeof passwordResetTokenTable>

export interface Database {
  undb_space: SpaceTable
  undb_base: BaseTable
  undb_table: TableTable
  undb_dashboard: DashboardTable
  undb_audit: AuditTable
  undb_dashboard_table_id_mapping: DashboardTableIdMapping
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
  undb_email_verification_code: EmailVerificationCodeTable
  undb_oauth_account: OAuthAccountTable
  undb_attachment: AttachmentsTable
  undb_attachment_mapping: AttachmentMappingTable
  undb_password_reset_token: PasswordResetTokenTable
}

export type Space = Selectable<SpaceTable>
export type Table = Selectable<TableTable>
export type Dashboard = Selectable<DashboardTable>
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
export type EmailVerificationCode = Selectable<EmailVerificationCodeTable>
export type OAuthAccount = Selectable<OAuthAccountTable>
export type Attachments = Selectable<AttachmentsTable>
export type AttachmentMapping = Selectable<AttachmentMappingTable>
export type PasswordResetToken = Selectable<PasswordResetTokenTable>

export type InsertTableIdMapping = Insertable<TableIdMappingTable>
export type InsertRollupIdMapping = Insertable<RollupIdMappingTable>
export type InsertReferenceIdMapping = Insertable<ReferenceIdMappingTable>
