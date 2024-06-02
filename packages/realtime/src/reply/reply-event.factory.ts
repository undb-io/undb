import type { BaseEvent, IEventJSON, Option } from "@undb/domain"
import type { Outbox } from "@undb/persistence"
import { RecordEventFactory } from "@undb/table"

export class ReplyEventFactory {
  static from(outbox: Outbox): Option<BaseEvent> {
    // TODO: just use date time timestamp
    return RecordEventFactory.fromJSON({ ...outbox, timestamp: outbox.timestamp.toISOString() } as IEventJSON)
  }
}
