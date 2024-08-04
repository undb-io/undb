import { getCurrentUserId, mustGetCurrentSpaceId } from "@undb/context/server"
import type { BaseEvent } from "@undb/domain"
import type { InsertOutbox } from "./db"
import { json } from "./qb"

export class OutboxMapper {
  static fromEvent(event: BaseEvent): InsertOutbox {
    const user = getCurrentUserId()
    const spaceId = mustGetCurrentSpaceId()
    return {
      id: event.id,
      name: event.name,
      payload: json(event.payload),
      space_id: spaceId,
      meta: event.meta ? json(event.meta) : null,
      operator_id: event.operatorId ?? user,
      timestamp: event.timestamp,
    }
  }
}
