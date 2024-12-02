import type { BaseEvent, IEventJSON, Option } from "@undb/domain"
import type { Outbox } from "@undb/persistence/server"
import { RecordEventFactory } from "@undb/table"

export class ReplyEventFactory {
  static from(outbox: Outbox): Option<BaseEvent> {
    // TODO: just use date time timestamp
    return RecordEventFactory.fromJSON(outbox.space_id, {
      ...outbox,
      spaceId: outbox.space_id,
      operatorId: outbox.user_id,
      timestamp: outbox.timestamp,
    } as IEventJSON)
  }
}
