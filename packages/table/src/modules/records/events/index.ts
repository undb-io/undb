import { RECORD_CREATED_EVENT, RecordCreatedEvent } from "./record-created.event"
import { RECORD_DELETED_EVENT, RecordDeletedEvent } from "./record-deleted.event"

export * from "./record-created.event"
export * from "./record-deleted.event"

export type IRecordEvent = RecordDeletedEvent | RecordCreatedEvent

export const RecordEvents = [RecordDeletedEvent, RecordCreatedEvent] as const

export * from "./record-event.factory"
export * from "./refine-record-events"

export const recordEvents = [RECORD_CREATED_EVENT, RECORD_DELETED_EVENT] as const
