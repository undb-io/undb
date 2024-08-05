import { Option, type IEventJSON } from "@undb/domain"
import { match } from "ts-pattern"
import {
  RecordCreatedEvent,
  RecordDeletedEvent,
  RecordUpdatedEvent,
  type IRecordCreatedEvent,
  type IRecordDeletedEvent,
  type IRecordEvent,
  type IRecordUpdatedEvent,
} from "."

export class RecordEventFactory {
  static fromJSON(spaceId: string, event: IEventJSON): Option<IRecordEvent> {
    const evt = match(event)
      .returnType<IRecordEvent | null>()
      .with(
        { name: "record.created" },
        (event) =>
          new RecordCreatedEvent(
            event.payload as IRecordCreatedEvent,
            event.meta,
            spaceId,
            event.id,
            new Date(event.timestamp),
          ),
      )
      .with(
        { name: "record.updated" },
        (event) =>
          new RecordUpdatedEvent(
            event.payload as IRecordUpdatedEvent,
            event.meta,
            spaceId,
            event.id,
            new Date(event.timestamp),
          ),
      )
      .with(
        { name: "record.deleted" },
        (event) =>
          new RecordDeletedEvent(
            event.payload as IRecordDeletedEvent,
            event.meta,
            spaceId,
            event.id,
            new Date(event.timestamp),
          ),
      )
      .otherwise(() => null)

    if (evt) {
      evt.operatorId = event.operatorId!
    }
    return Option(evt)
  }
}
