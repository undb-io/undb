import type { BaseEvent } from "@undb/domain"
import type { Outbox } from "./tables"

export class OutboxMapper {
  static fromEvent(event: BaseEvent): Outbox {
    return {
      id: event.id,
      name: event.name,
      payload: event.payload,
      meta: event.meta,
      operatorId: event.operatorId ?? "123",
      timestamp: event.timestamp.toISOString(),
    }
  }
}
