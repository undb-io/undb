import { ISpaceMemberService, SPACE_MEMBER_SERVICE } from "@undb/authz"
import {
  BulkDeleteRecordsCommandHandler,
  BulkDuplicateRecordsCommandHandler,
  BulkUpdateRecordsCommandHandler,
  CreateBaseCommandHandler,
  CreateFromTemplateCommandHandler,
  CreateRecordCommandHandler,
  CreateTableFieldCommandHandler,
  CreateTableViewCommandHandler,
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
import { registerDataService, registerQueryBuilder } from "@undb/data-service"
import { container } from "@undb/di"
import {
  GetAggregatesQueryHandler,
  GetBaseQueryHandler,
  GetDashboardByIdQueryHandler,
  GetDashboardsQueryHandler,
  GetRecordByIdQueryHandler,
  GetRecordsQueryHandler,
  GetTableQueryHandler,
  GetTablesQueryHandler,
} from "@undb/query-handlers"

const commandHandlers = [
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
]

class Registry {
  #registered = $state(false)
  #registeredLocal = $state(false)

  async register(isLocal = false) {
    // if (isLocal) {
    if (!this.#registeredLocal) {
      await registerQueryBuilder()
      this.#registeredLocal = true
    }
    // }

    if (!this.#registered) {
      registerDataService()

      const commandBus = container.resolve(CommandBus)
      commandBus.register(commandHandlers)

      const queryBus = container.resolve(QueryBus)
      queryBus.register(queryHandlers)

      // TODO: move to other place
      const context = container.resolve<IContext>(CONTEXT_TOKEN)
      const spaceMemberService = container.resolve<ISpaceMemberService>(SPACE_MEMBER_SERVICE)
      await spaceMemberService.createMember(context.mustGetCurrentUserId(), context.mustGetCurrentSpaceId(), "admin")

      this.#registered = true
    }
  }
}

export const registry = new Registry()
