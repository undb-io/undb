import { CreateFromTemplateCommandHandler, DeleteBaseCommandHandler } from "@undb/command-handlers"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { registerDataService, registerQueryBuilder } from "@undb/data-service"
import { container } from "@undb/di"
import {
  GetAggregatesQueryHandler,
  GetRecordByIdQueryHandler,
  GetRecordsQueryHandler,
  GetTableQueryHandler,
} from "@undb/query-handlers"

const commandHandlers = [CreateFromTemplateCommandHandler, DeleteBaseCommandHandler]
const queryHandlers = [
  GetRecordsQueryHandler,
  GetRecordByIdQueryHandler,
  GetTableQueryHandler,
  GetAggregatesQueryHandler,
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

      this.#registered = true
    }
  }
}

export const registry = new Registry()
