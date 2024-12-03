import { CreateFromTemplateCommandHandler } from "@undb/command-handlers"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { registerDataService } from "@undb/data-service"
import { container } from "@undb/di"
import { GetRecordsQueryHandler } from "@undb/query-handlers"

const commandHandlers = [CreateFromTemplateCommandHandler]
const queryHandlers = [GetRecordsQueryHandler]

export const register = async () => {
  await registerDataService()

  const commandBus = container.resolve(CommandBus)
  commandBus.register(commandHandlers)

  const queryBus = container.resolve(QueryBus)
  queryBus.register(queryHandlers)
}
