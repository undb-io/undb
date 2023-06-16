import { EVT_RECORD_BULK_CREATED, RecordBulkCreatedEvent } from './record-bulk-created.event.js'
import { EVT_RECORD_BULK_DELETED, RecordBulkDeletedEvent } from './record-bulk-deleted.event.js'
import { EVT_RECORD_BULK_UPDATED, RecordBulkUpdatedEvent } from './record-bulk-updated.event.js'
import { EVT_RECORD_CREATED, RecordCreatedEvent } from './record-created.event.js'
import { EVT_RECORD_DELETED, RecordDeletedEvent } from './record-deleted.event.js'
import { EVT_RECORD_UPDATED, RecordUpdatedEvent } from './record-updated.event.js'

export * from './record-bulk-created.event.js'
export * from './record-bulk-deleted.event.js'
export * from './record-bulk-updated.event.js'
export * from './record-created.event.js'
export * from './record-deleted.event.js'
export * from './record-updated.event.js'

export const EVT_RECORD_ALL = 'record.*' as const

export type IRecordEvents =
  | RecordCreatedEvent
  | RecordUpdatedEvent
  | RecordDeletedEvent
  | RecordBulkCreatedEvent
  | RecordBulkUpdatedEvent
  | RecordBulkDeletedEvent

export const RecordEvents = [
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
