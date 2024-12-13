import {
  INVITATION_QUERY_REPOSITORY,
  INVITATION_REPOSITORY,
  SPACE_MEMBER_REPOSITORY,
  SPACE_MEMBER_SERVICE,
  SpaceMemberService,
} from "@undb/authz"
import { BASE_OUTBOX_SERVICE, BASE_QUERY_REPOSITORY, BASE_REPOSITORY } from "@undb/base"
import { CONTEXT_TOKEN } from "@undb/context"
import {
  DASHBOARD_OUTBOX_SERVICE,
  DASHBOARD_QUERY_REPOSITORY,
  DASHBOARD_QUERY_SERVICE,
  DASHBOARD_REPOSITORY,
  DashboardQueryService,
} from "@undb/dashboard"
import { type DependencyContainer } from "@undb/di"
import { MAIL_SERVICE, type IMailService, type ISendInput } from "@undb/mail"
import {
  BaseOutboxService,
  BaseQueryRepository,
  BaseRepository,
  createSqljsQueryBuilder,
  DashboardOutboxService,
  DashboardQueryRepository,
  DashboardRepository,
  InvitationQueryRepository,
  InvitationRepository,
  QUERY_BUILDER,
  RecordOutboxService,
  RecordQueryRepository,
  RecordRepository,
  SpaceMemberRepository,
  SpaceQueryRepository,
  SpaceRepostitory,
  TableOutboxService,
  TableQueryRepository,
  TableRepository,
  TemplateQueryRepository,
  TX_CTX,
} from "@undb/persistence/client"
import { SPACE_QUERY_REPOSITORY, SPACE_REPOSITORY, SPACE_SERVICE, SpaceService } from "@undb/space"
import {
  OBJECT_STORAGE,
  RECORD_OUTBOX_SERVICE,
  RECORD_QUERY_REPOSITORY,
  RECORD_REPOSITORY,
  RECORDS_QUERY_SERVICE,
  RECORDS_SERVICE,
  RecordsQueryService,
  RecordsService,
  TABLE_OUTBOX_SERVICE,
  TABLE_QUERY_REPOSITORY,
  TABLE_REPOSITORY,
  type IObjectStorage,
  type IPresign,
  type IPutObject,
} from "@undb/table"
import { TEMPLATE_QUERY_REPOSITORY } from "@undb/template"
import { DataServiceContext, DataServicetTxContext } from "./data-service.context"
import { IS_LOCAL, IS_PLAYGROUND } from "./data-service.provider"

class MailService implements IMailService {
  async send(input: ISendInput): Promise<void> {}
}

class LocalObjectStorage implements IObjectStorage {
  presign(fileName: string, path: string, mimeType: string): Promise<IPresign> {
    throw new Error("Method not implemented.")
  }
  getPreviewUrl(fileName: string): Promise<string> {
    throw new Error("Method not implemented.")
  }
  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject> {
    throw new Error("Method not implemented.")
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}

export const registerDataService = async (container: DependencyContainer, isLocal: boolean, isPlayground: boolean) => {
  container.register(IS_LOCAL, { useValue: isLocal })
  container.register(IS_PLAYGROUND, { useValue: isPlayground })
  const qb = isLocal ? await createSqljsQueryBuilder() : await createSqljsQueryBuilder()
  container.register(QUERY_BUILDER, { useValue: qb })
  container.register(TX_CTX, DataServicetTxContext)
  container.register(CONTEXT_TOKEN, DataServiceContext)
  container.register(BASE_OUTBOX_SERVICE, BaseOutboxService)
  container.register(BASE_REPOSITORY, BaseRepository)
  container.register(TABLE_REPOSITORY, TableRepository)
  container.register(TABLE_OUTBOX_SERVICE, TableOutboxService)
  container.register(TEMPLATE_QUERY_REPOSITORY, TemplateQueryRepository)
  container.register(RECORD_REPOSITORY, RecordRepository)
  container.register(RECORD_OUTBOX_SERVICE, RecordOutboxService)
  container.register(DASHBOARD_REPOSITORY, DashboardRepository)
  container.register(DASHBOARD_OUTBOX_SERVICE, DashboardOutboxService)
  container.register(SPACE_MEMBER_SERVICE, SpaceMemberService)
  container.register(SPACE_SERVICE, SpaceService)
  container.register(SPACE_REPOSITORY, SpaceRepostitory)
  container.register(SPACE_QUERY_REPOSITORY, SpaceQueryRepository)
  container.register(SPACE_MEMBER_REPOSITORY, SpaceMemberRepository)
  container.register(INVITATION_REPOSITORY, InvitationRepository)
  container.register(INVITATION_QUERY_REPOSITORY, InvitationQueryRepository)
  container.register(MAIL_SERVICE, MailService)
  container.register(RECORDS_QUERY_SERVICE, RecordsQueryService)
  container.register(RECORDS_SERVICE, RecordsService)
  container.register(RECORD_QUERY_REPOSITORY, RecordQueryRepository)
  container.register(OBJECT_STORAGE, LocalObjectStorage)
  container.register(TABLE_QUERY_REPOSITORY, TableQueryRepository)
  container.register(BASE_QUERY_REPOSITORY, BaseQueryRepository)
  container.register(DASHBOARD_QUERY_SERVICE, DashboardQueryService)
  container.register(DASHBOARD_QUERY_REPOSITORY, DashboardQueryRepository)
}
