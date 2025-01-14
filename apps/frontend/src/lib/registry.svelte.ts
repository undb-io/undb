import { ISpaceMemberService, SPACE_MEMBER_SERVICE } from "@undb/authz"
import {
  AddDashboardWidgetCommandHandler,
  BulkDeleteRecordsCommandHandler,
  BulkDuplicateRecordsCommandHandler,
  BulkUpdateRecordsCommandHandler,
  CreateBaseCommandHandler,
  CreateFromTemplateCommandHandler,
  CreateRecordCommandHandler,
  CreateRecordsCommandHandler,
  CreateTableCommandHandler,
  CreateTableFieldCommandHandler,
  CreateTableViewCommandHandler,
  CreateViewWidgetCommandHandler,
  DeleteBaseCommandHandler,
  DeleteTableCommandHandler,
  DeleteTableFieldCommandHandler,
  DeleteViewCommandHandler,
  DuplicateTableFieldCommandHandler,
  DuplicateViewCommandHandler,
  SetViewColorCommandHandler,
  SetViewFieldsCommandHandler,
  SetViewFilterCommandHandler,
  SetViewOptionCommandHandler,
  SetViewSortCommandHandler,
  UpdateRecordCommandHandler,
  UpdateTableFieldCommandHandler,
  UpdateViewCommandHandler,
} from "@undb/command-handlers"
import { CONTEXT_TOKEN, IContext } from "@undb/context"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { DataService, registerDataService, TRPC_CLIENT } from "@undb/data-service"
import { container } from "@undb/di"
import { DB_PROVIDER } from "@undb/persistence/client"
import {
  GetAggregatesQueryHandler,
  GetBaseQueryHandler,
  GetBasesQueryHandler,
  GetDashboardByIdQueryHandler,
  GetDashboardsQueryHandler,
  GetRecordByIdQueryHandler,
  GetRecordsQueryHandler,
  GetTableQueryHandler,
  GetTablesQueryHandler,
  GetTemplatesQueryHandler,
} from "@undb/query-handlers"
import { trpc } from "./trpc/client"

const commandHandlers = [
  AddDashboardWidgetCommandHandler,
  BulkDuplicateRecordsCommandHandler,
  BulkDeleteRecordsCommandHandler,
  BulkUpdateRecordsCommandHandler,
  CreateFromTemplateCommandHandler,
  CreateRecordCommandHandler,
  DeleteBaseCommandHandler,
  CreateBaseCommandHandler,
  UpdateRecordCommandHandler,
  DeleteTableCommandHandler,
  DuplicateViewCommandHandler,
  DeleteViewCommandHandler,
  SetViewFilterCommandHandler,
  SetViewColorCommandHandler,
  SetViewFieldsCommandHandler,
  SetViewSortCommandHandler,
  DeleteTableFieldCommandHandler,
  CreateTableFieldCommandHandler,
  UpdateTableFieldCommandHandler,
  DuplicateTableFieldCommandHandler,
  CreateTableViewCommandHandler,
  UpdateViewCommandHandler,
  SetViewOptionCommandHandler,
  CreateTableCommandHandler,
  CreateRecordsCommandHandler,
  CreateViewWidgetCommandHandler,
]

const queryHandlers = [
  GetTablesQueryHandler,
  GetRecordsQueryHandler,
  GetRecordByIdQueryHandler,
  GetTableQueryHandler,
  GetAggregatesQueryHandler,
  GetBaseQueryHandler,
  GetDashboardsQueryHandler,
  GetDashboardByIdQueryHandler,
  GetTemplatesQueryHandler,
  GetBasesQueryHandler,
]

export class Registry {
  async register(isLocal: boolean, isPlayground: boolean): Promise<DataService> {
    const childContainer = container.createChildContainer()

    childContainer.register(DB_PROVIDER, { useValue: "sqlite" })
    childContainer.register(TRPC_CLIENT, { useValue: trpc })
    await registerDataService(childContainer, isLocal, isPlayground)

    const commandBus = childContainer.resolve(CommandBus)
    commandBus.register(commandHandlers, childContainer)

    const queryBus = childContainer.resolve(QueryBus)
    queryBus.register(queryHandlers, childContainer)

    // TODO: move to other file
    const context = childContainer.resolve<IContext>(CONTEXT_TOKEN)
    const spaceMemberService = childContainer.resolve<ISpaceMemberService>(SPACE_MEMBER_SERVICE)
    await spaceMemberService.createMember(context.mustGetCurrentUserId(), context.mustGetCurrentSpaceId(), "admin")

    return childContainer.resolve(DataService)
  }
}
