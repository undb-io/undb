import { AUDIT_QUERY_REPOSITORY, AUDIT_REPOSITORY } from "@undb/audit"
import {
  WORKSPACE_MEMBER_REPOSITORY,
  WORKSPACE_MEMBER_SERVICE,
  WORKSPQACE_MEMBER_QUERY_REPOSITORY,
  WorkspaceMemberService,
} from "@undb/authz"
import { BASE_OUTBOX_SERVICE, BASE_QUERY_REPOSITORY, BASE_REPOSITORY } from "@undb/base"
import { container } from "@undb/di"
import {
  AuditQueryRepository,
  AuditRepository,
  BaseOutboxService,
  BaseQueryRepository,
  BaseRepository,
  DB_UNIT_OF_WORK_PROVIDER,
  DatabaseUnitOfWork,
  RecordOutboxService,
  RecordQueryRepository,
  RecordRepository,
  TableOutboxService,
  TableQueryRepository,
  TableRepository,
  WebhookQueryRepository,
  WebhookRepository,
  WorkspaceMemberQueryRepository,
  WorkspaceMemberRepository,
} from "@undb/persistence"
import {
  RECORD_OUTBOX_SERVICE,
  RECORD_QUERY_REPOSITORY,
  RECORD_REPOSITORY,
  TABLE_OUTBOX_SERVICE,
  TABLE_QUERY_REPOSITORY,
  TABLE_REPOSITORY,
} from "@undb/table"
import { WEBHOOK_QUERY_REPOSITORY, WEBHOOK_REPOSITORY } from "@undb/webhook"

export const registerDb = () => {
  container.register(TABLE_REPOSITORY, TableRepository)
  container.register(TABLE_QUERY_REPOSITORY, TableQueryRepository)
  container.register(RECORD_QUERY_REPOSITORY, RecordQueryRepository)
  container.register(RECORD_REPOSITORY, RecordRepository)
  container.register(RECORD_OUTBOX_SERVICE, RecordOutboxService)
  container.register(TABLE_OUTBOX_SERVICE, TableOutboxService)
  container.register(DB_UNIT_OF_WORK_PROVIDER, DatabaseUnitOfWork)
  container.register(WEBHOOK_REPOSITORY, WebhookRepository)
  container.register(WEBHOOK_QUERY_REPOSITORY, WebhookQueryRepository)
  container.register(AUDIT_REPOSITORY, AuditRepository)
  container.register(AUDIT_QUERY_REPOSITORY, AuditQueryRepository)
  container.register(WORKSPACE_MEMBER_REPOSITORY, WorkspaceMemberRepository)
  container.register(WORKSPQACE_MEMBER_QUERY_REPOSITORY, WorkspaceMemberQueryRepository)
  container.register(WORKSPACE_MEMBER_SERVICE, WorkspaceMemberService)
  container.register(BASE_REPOSITORY, BaseRepository)
  container.register(BASE_QUERY_REPOSITORY, BaseQueryRepository)
  container.register(BASE_OUTBOX_SERVICE, BaseOutboxService)
}
