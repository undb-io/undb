import { AUDIT_QUERY_REPOSITORY, AUDIT_REPOSITORY } from "@undb/audit"
import {
  INVITATION_QUERY_REPOSITORY,
  INVITATION_REPOSITORY,
  SPACE_MEMBER_REPOSITORY,
  SPACE_MEMBER_SERVICE,
  SpaceMemberService,
  WORKSPQACE_MEMBER_QUERY_REPOSITORY,
} from "@undb/authz"
import { BASE_OUTBOX_SERVICE, BASE_QUERY_REPOSITORY, BASE_REPOSITORY } from "@undb/base"
import { CONTEXT_TOKEN } from "@undb/context"
import { ServerContext } from "@undb/context/server"
import { DASHBOARD_OUTBOX_SERVICE, DASHBOARD_QUERY_REPOSITORY, DASHBOARD_REPOSITORY } from "@undb/dashboard"
import { container, instanceCachingFactory } from "@undb/di"
import { env } from "@undb/env"
import { API_TOKEN_QUERY_REPOSITORY, API_TOKEN_REPOSITORY, API_TOKEN_SERVICE, ApiTokenService } from "@undb/openapi"
import {
  ApiTokenQueryRepository,
  ApiTokenRepository,
  AuditQueryRepository,
  AuditRepository,
  BaseOutboxService,
  BaseQueryRepository,
  BaseRepository,
  Client,
  createMysqlClient,
  createMysqlQueryBuilder,
  createPostgresClient,
  createPostgresQueryBuilder,
  createSqliteClient,
  createSqliteQueryBuilder,
  createTursoClient,
  createTursoQueryBuilder,
  CTX,
  DashboardOutboxService,
  DashboardQueryRepository,
  DashboardRepository,
  DATABASE_CLIENT,
  DB_PROVIDER,
  InvitationQueryRepository,
  InvitationRepository,
  QUERY_BUILDER,
  RecordOutboxService,
  RecordQueryRepository,
  RecordRepository,
  ShareQueryRepository,
  ShareRepository,
  SpaceMemberQueryRepository,
  SpaceMemberRepository,
  SpaceQueryRepository,
  SpaceRepostitory,
  TableOutboxService,
  TableQueryRepository,
  TableRepository,
  TemplateQueryRepository,
  TX_CTX,
  TxContext,
  TxContextImpl,
  UserQueryRepository,
  UserRepository,
  WebhookQueryRepository,
  WebhookRepository,
} from "@undb/persistence/server"
import { SHARE_QUERY_REPOSITORY, SHARE_REPOSITORY, SHARE_SERVICE, ShareService } from "@undb/share"
import { SPACE_QUERY_REPOSITORY, SPACE_REPOSITORY, SPACE_SERVICE, SpaceService } from "@undb/space"
import {
  RECORD_OUTBOX_SERVICE,
  RECORD_QUERY_REPOSITORY,
  RECORD_REPOSITORY,
  TABLE_OUTBOX_SERVICE,
  TABLE_QUERY_REPOSITORY,
  TABLE_REPOSITORY,
} from "@undb/table"
import { TEMPLATE_QUERY_REPOSITORY } from "@undb/template"
import { USER_QUERY_REPOSITORY, USER_REPOSITORY, USER_SERVICE, UserService } from "@undb/user"
import { WEBHOOK_QUERY_REPOSITORY, WEBHOOK_REPOSITORY } from "@undb/webhook"
import Database from "bun:sqlite"
import mysql from "mysql2/promise"
import { AsyncLocalStorage } from "node:async_hooks"
import postgres from "postgres"

const txContext = new AsyncLocalStorage<TxContext>()

export const registerDb = () => {
  container.register(DB_PROVIDER, { useValue: env.UNDB_DB_PROVIDER || "sqlite" })
  container.register(CTX, { useValue: txContext })
  container.register(DATABASE_CLIENT, {
    useFactory: instanceCachingFactory(() => {
      const dbProvider = container.resolve<string>(DB_PROVIDER)
      if (dbProvider === "sqlite" || !dbProvider) {
        return createSqliteClient("undb.sqlite")
      }
      if (dbProvider === "postgres") {
        return createPostgresClient(env.UNDB_DB_POSTGRES_URL!)
      }
      if (dbProvider === "mysql") {
        return createMysqlClient(env.UNDB_DB_MYSQL_URL!)
      }
      return createTursoClient(env.UNDB_DB_TURSO_URL!, env.UNDB_DB_TURSO_AUTH_TOKEN)
    }),
  })
  container.register(QUERY_BUILDER, {
    useFactory: instanceCachingFactory((c) => {
      const dbProvider = container.resolve<string>(DB_PROVIDER)
      if (dbProvider === "sqlite" || !dbProvider) {
        const sqlite = c.resolve<Database>(DATABASE_CLIENT)
        return createSqliteQueryBuilder(sqlite)
      } else if (dbProvider === "postgres") {
        const pg = c.resolve<postgres.Sql>(DATABASE_CLIENT)
        return createPostgresQueryBuilder(pg)
      } else if (dbProvider === "mysql") {
        const mysql = c.resolve<mysql.Pool>(DATABASE_CLIENT)
        return createMysqlQueryBuilder(mysql)
      }

      const sqlite = c.resolve<Client>(DATABASE_CLIENT)
      return createTursoQueryBuilder(sqlite)
    }),
  })
  container.register(TX_CTX, TxContextImpl)

  container.register(CONTEXT_TOKEN, ServerContext)
  container.register(SPACE_REPOSITORY, SpaceRepostitory)
  container.register(SPACE_QUERY_REPOSITORY, SpaceQueryRepository)
  container.register(SPACE_SERVICE, SpaceService)
  container.register(TABLE_REPOSITORY, TableRepository)
  container.register(TABLE_QUERY_REPOSITORY, TableQueryRepository)
  container.register(RECORD_QUERY_REPOSITORY, RecordQueryRepository)
  container.register(RECORD_REPOSITORY, RecordRepository)
  container.register(RECORD_OUTBOX_SERVICE, RecordOutboxService)
  container.register(TABLE_OUTBOX_SERVICE, TableOutboxService)
  container.register(DASHBOARD_REPOSITORY, DashboardRepository)
  container.register(DASHBOARD_QUERY_REPOSITORY, DashboardQueryRepository)
  container.register(DASHBOARD_OUTBOX_SERVICE, DashboardOutboxService)
  container.register(WEBHOOK_REPOSITORY, WebhookRepository)
  container.register(WEBHOOK_QUERY_REPOSITORY, WebhookQueryRepository)
  container.register(AUDIT_REPOSITORY, AuditRepository)
  container.register(AUDIT_QUERY_REPOSITORY, AuditQueryRepository)
  container.register(SPACE_MEMBER_REPOSITORY, SpaceMemberRepository)
  container.register(INVITATION_REPOSITORY, InvitationRepository)
  container.register(INVITATION_QUERY_REPOSITORY, InvitationQueryRepository)
  container.register(WORKSPQACE_MEMBER_QUERY_REPOSITORY, SpaceMemberQueryRepository)
  container.register(SPACE_MEMBER_SERVICE, SpaceMemberService)
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
  container.register(TEMPLATE_QUERY_REPOSITORY, TemplateQueryRepository)
}
