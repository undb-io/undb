import { RecordCreatedEvent } from "./record-created.event"
import { RecordDeletedEvent } from "./record-deleted.event"

export * from "./record-created.event"
export * from "./record-deleted.event"

export type IRecordEvent = RecordDeletedEvent | RecordCreatedEvent

export const RecordEvents = [RecordDeletedEvent, RecordCreatedEvent]

export * from "./record-event.factory"
export * from "./refine-record-events"
