import type { BaseEvent } from "@undb/domain"
import type { InsertOutbox } from "./db"
import { json } from "./qb"

export class OutboxMapper {
  static fromEvent(event: BaseEvent): InsertOutbox {
    return {
      id: event.id,
      name: event.name,
      payload: json(event.payload),
      meta: event.meta ? json(event.meta) : null,
      operator_id: event.operatorId ?? "123",
      timestamp: event.timestamp,
    }
  }
}
