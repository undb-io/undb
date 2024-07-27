import { AUDIT_QUERY_REPOSITORY, AUDIT_REPOSITORY } from "@undb/audit"
import {
  INVITATION_QUERY_REPOSITORY,
  INVITATION_REPOSITORY,
  WORKSPACE_MEMBER_REPOSITORY,
  WORKSPACE_MEMBER_SERVICE,
  WORKSPQACE_MEMBER_QUERY_REPOSITORY,
  WorkspaceMemberService,
} from "@undb/authz"
import { BASE_OUTBOX_SERVICE, BASE_QUERY_REPOSITORY, BASE_REPOSITORY } from "@undb/base"
import { container } from "@undb/di"
import { API_TOKEN_QUERY_REPOSITORY, API_TOKEN_REPOSITORY, API_TOKEN_SERVICE, ApiTokenService } from "@undb/openapi"
import {
  ApiTokenQueryRepository,
  ApiTokenRepository,
  AuditQueryRepository,
  AuditRepository,
  BaseOutboxService,
  BaseQueryRepository,
  BaseRepository,
  InvitationQueryRepository,
  InvitationRepository,
  RecordOutboxService,
  RecordQueryRepository,
  RecordRepository,
  ShareQueryRepository,
  ShareRepository,
  TableOutboxService,
  TableQueryRepository,
  TableRepository,
  UserQueryRepository,
  UserRepository,
  WebhookQueryRepository,
  WebhookRepository,
  WorkspaceMemberQueryRepository,
  WorkspaceMemberRepository,
} from "@undb/persistence"
import { SHARE_QUERY_REPOSITORY, SHARE_REPOSITORY, SHARE_SERVICE, ShareService } from "@undb/share"
import {
  RECORD_OUTBOX_SERVICE,
  RECORD_QUERY_REPOSITORY,
  RECORD_REPOSITORY,
  TABLE_OUTBOX_SERVICE,
  TABLE_QUERY_REPOSITORY,
  TABLE_REPOSITORY,
} from "@undb/table"
import { USER_QUERY_REPOSITORY, USER_REPOSITORY, USER_SERVICE, UserService } from "@undb/user"
import { WEBHOOK_QUERY_REPOSITORY, WEBHOOK_REPOSITORY } from "@undb/webhook"

export const registerDb = () => {
  container.register(TABLE_REPOSITORY, TableRepository)
  container.register(TABLE_QUERY_REPOSITORY, TableQueryRepository)
  container.register(RECORD_QUERY_REPOSITORY, RecordQueryRepository)
  container.register(RECORD_REPOSITORY, RecordRepository)
  container.register(RECORD_OUTBOX_SERVICE, RecordOutboxService)
  container.register(TABLE_OUTBOX_SERVICE, TableOutboxService)
  container.register(WEBHOOK_REPOSITORY, WebhookRepository)
  container.register(WEBHOOK_QUERY_REPOSITORY, WebhookQueryRepository)
  container.register(AUDIT_REPOSITORY, AuditRepository)
  container.register(AUDIT_QUERY_REPOSITORY, AuditQueryRepository)
  container.register(WORKSPACE_MEMBER_REPOSITORY, WorkspaceMemberRepository)
  container.register(INVITATION_REPOSITORY, InvitationRepository)
  container.register(INVITATION_QUERY_REPOSITORY, InvitationQueryRepository)
  container.register(WORKSPQACE_MEMBER_QUERY_REPOSITORY, WorkspaceMemberQueryRepository)
  container.register(WORKSPACE_MEMBER_SERVICE, WorkspaceMemberService)
  container.register(USER_QUERY_REPOSITORY, UserQueryRepository)
  container.register(USER_REPOSITORY, UserRepository)
  container.register(USER_SERVICE, UserService)
  container.register(BASE_REPOSITORY, BaseRepository)
  container.register(BASE_QUERY_REPOSITORY, BaseQueryRepository)
  container.register(BASE_OUTBOX_SERVICE, BaseOutboxService)
  container.register(SHARE_SERVICE, ShareService)
  container.register(SHARE_REPOSITORY, ShareRepository)
  container.register(SHARE_QUERY_REPOSITORY, ShareQueryRepository)
  container.register(API_TOKEN_REPOSITORY, ApiTokenRepository)
  container.register(API_TOKEN_QUERY_REPOSITORY, ApiTokenQueryRepository)
  container.register(API_TOKEN_SERVICE, ApiTokenService)
}
