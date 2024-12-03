import type { IContext } from "@undb/context"
import type { BaseEvent } from "@undb/domain"
import type { InsertOutbox } from "./db"
import { json } from "./qb.util"

export class OutboxMapper {
  static fromEvent(event: BaseEvent, context: IContext): InsertOutbox {
    const user = context.getCurrentUserId()
    const spaceId = event.spaceId ?? context.mustGetCurrentSpaceId()
    return {
      id: event.id,
      name: event.name,
      payload: json(event.payload),
      space_id: spaceId,
      meta: event.meta ? json(event.meta) : null,
      user_id: event.operatorId ?? user,
      timestamp: event.timestamp.getTime(),
    }
  }
}
