import { EventBus } from "@undb/cqrs"
import { container } from "@undb/di"
import { eventHandlers } from "./handlers"

export const registerEvents = () => {
  const eventBus = container.resolve(EventBus)
  eventBus.register(eventHandlers)
}
