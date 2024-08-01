import { RECORD_CREATED_EVENT, RecordCreatedEvent } from "./record-created.event"
import { RECORD_DELETED_EVENT, RecordDeletedEvent } from "./record-deleted.event"
import { RECORD_UPDATED_EVENT, RecordUpdatedEvent } from "./record-updated.event"

export * from "./record-created.event"
export * from "./record-deleted.event"
export * from "./record-updated.event"

export type IRecordEvent = RecordDeletedEvent | RecordCreatedEvent | RecordUpdatedEvent

export const RecordEvents = [RecordDeletedEvent, RecordCreatedEvent, RecordUpdatedEvent] as const

export * from "./record-event.factory"
export * from "./refine-record-events"

export const recordEvents = [RECORD_CREATED_EVENT, RECORD_DELETED_EVENT, RECORD_UPDATED_EVENT] as const

export type RECORD_EVENTS = (typeof recordEvents)[number]

export * from "./record-event.service"
