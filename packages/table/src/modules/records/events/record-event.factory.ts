import { Option, type IEventJSON } from "@undb/domain"
import {
  RecordCreatedEvent,
  RecordDeletedEvent,
  type IRecordCreatedEvent,
  type IRecordDeletedEvent,
  type IRecordEvent,
} from "."
import { match } from "ts-pattern"

export class RecordEventFactory {
  static fromJSON(event: IEventJSON): Option<IRecordEvent> {
    const evt = match(event)
      .returnType<IRecordEvent | null>()
      .with(
        { name: "record.created" },
        (event) =>
          new RecordCreatedEvent(event.payload as IRecordCreatedEvent, event.meta, event.id, new Date(event.timestamp)),
      )
      .with(
        { name: "record.deleted" },
        (event) =>
          new RecordDeletedEvent(event.payload as IRecordDeletedEvent, event.meta, event.id, new Date(event.timestamp)),
      )
      .otherwise(() => null)

    return Option(evt)
  }
}
