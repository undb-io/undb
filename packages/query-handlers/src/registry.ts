import { QueryBus } from "@undb/cqrs"
import { container } from "@undb/di"
import { queryHandlers } from "./handlers"

export const registerQueries = () => {
  const queryBus = container.resolve(QueryBus)
  queryBus.register(queryHandlers)
}
