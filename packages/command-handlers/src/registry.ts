import { CommandBus } from "@undb/cqrs"
import { container } from "@undb/di"
import { commandHandlers } from "./handlers"

export const registerCommands = () => {
  const commandBus = container.resolve(CommandBus)
  commandBus.register(commandHandlers)
}
