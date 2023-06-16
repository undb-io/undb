import { z } from 'zod'
import {
  EVT_RECORD_BULK_CREATED,
  RecordBulkCreatedEvent,
  recordsBulkCreatedEvent,
} from './record-bulk-created.event.js'
import {
  EVT_RECORD_BULK_DELETED,
  RecordBulkDeletedEvent,
  recordsBulkDeletedEvent,
} from './record-bulk-deleted.event.js'
import {
  EVT_RECORD_BULK_UPDATED,
  RecordBulkUpdatedEvent,
  recordsBulkUpdatedEvent,
} from './record-bulk-updated.event.js'
import { EVT_RECORD_CREATED, RecordCreatedEvent, recordCreatedEvent } from './record-created.event.js'
import { EVT_RECORD_DELETED, RecordDeletedEvent, recordDeletedEvent } from './record-deleted.event.js'
import { EVT_RECORD_UPDATED, RecordUpdatedEvent, recordUpdatedEvent } from './record-updated.event.js'

export * from './record-bulk-created.event.js'
export * from './record-bulk-deleted.event.js'
export * from './record-bulk-updated.event.js'
export * from './record-created.event.js'
export * from './record-deleted.event.js'
export * from './record-updated.event.js'

export const EVT_RECORD_ALL = 'record.*' as const

export type RecordEvents =
  | RecordCreatedEvent
  | RecordUpdatedEvent
  | RecordDeletedEvent
  | RecordBulkCreatedEvent
  | RecordBulkUpdatedEvent
  | RecordBulkDeletedEvent

export const RecordEventsClasses = [
  RecordCreatedEvent,
  RecordUpdatedEvent,
  RecordDeletedEvent,
  RecordBulkCreatedEvent,
  RecordBulkUpdatedEvent,
  RecordBulkDeletedEvent,
]

export const recordEvents = [
  EVT_RECORD_ALL,
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_UPDATED,
] as const

export const recorEventSchema = z.discriminatedUnion('name', [
  recordCreatedEvent,
  recordUpdatedEvent,
  recordDeletedEvent,
  recordsBulkCreatedEvent,
  recordsBulkUpdatedEvent,
  recordsBulkDeletedEvent,
])

export type IRecordEvents = z.infer<typeof recorEventSchema>
