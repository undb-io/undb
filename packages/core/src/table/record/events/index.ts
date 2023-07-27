import { z } from 'zod'
import type { Table } from '../../table.js'
import { createRecordReadableValueSchema } from '../record.readable.js'
import {
  EVT_RECORD_BULK_CREATED,
  RecordBulkCreatedEvent,
  recordsBulkCreatedEvent,
  recordsBulkCreatedEventPayload,
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
  recordsBulkUpdatedEventPayload,
} from './record-bulk-updated.event.js'
import {
  EVT_RECORD_CREATED,
  RecordCreatedEvent,
  recordCreatedEvent,
  recordCreatedEventPayload,
} from './record-created.event.js'
import { EVT_RECORD_DELETED, RecordDeletedEvent, recordDeletedEvent } from './record-deleted.event.js'
import { EVT_RECORD_RESTORED, RecordRestoredEvent, recordRestoredEvent } from './record-restored.event.js'
import {
  EVT_RECORD_UPDATED,
  RecordUpdatedEvent,
  recordUpdatedEvent,
  recordUpdatedEventPayload,
} from './record-updated.event.js'

export * from './record-bulk-created.event.js'
export * from './record-bulk-deleted.event.js'
export * from './record-bulk-updated.event.js'
export * from './record-created.event.js'
export * from './record-deleted.event.js'
export * from './record-restored.event.js'
export * from './record-updated.event.js'

export const EVT_RECORD_ALL = 'record.*' as const

export type RecordEvents =
  | RecordCreatedEvent
  | RecordUpdatedEvent
  | RecordDeletedEvent
  | RecordRestoredEvent
  | RecordBulkCreatedEvent
  | RecordBulkUpdatedEvent
  | RecordBulkDeletedEvent

export const RecordEventsClasses = [
  RecordCreatedEvent,
  RecordUpdatedEvent,
  RecordDeletedEvent,
  RecordRestoredEvent,
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
  EVT_RECORD_RESTORED,
] as const

export const recorEventSchema = z.discriminatedUnion('name', [
  recordCreatedEvent,
  recordUpdatedEvent,
  recordDeletedEvent,
  recordRestoredEvent,
  recordsBulkCreatedEvent,
  recordsBulkUpdatedEvent,
  recordsBulkDeletedEvent,
])

export type IRecordEvents = z.infer<typeof recorEventSchema>

export const createRecordEventReadableValueSchema = (table: Table) => {
  const record = createRecordReadableValueSchema(table)
  return z.discriminatedUnion('name', [
    recordCreatedEvent.merge(
      z.object({
        payload: recordCreatedEventPayload.merge(z.object({ record })),
      }),
    ),
    recordUpdatedEvent.merge(
      z.object({
        payload: recordUpdatedEventPayload.merge(
          z.object({
            previousRecord: record.partial(),
            record: record.partial(),
          }),
        ),
      }),
    ),
    recordDeletedEvent,
    recordRestoredEvent,
    recordsBulkCreatedEvent.merge(
      z.object({
        payload: recordsBulkCreatedEventPayload.merge(
          z.object({
            records: record.partial().array(),
          }),
        ),
      }),
    ),
    recordsBulkUpdatedEvent.merge(
      z.object({
        payload: recordsBulkUpdatedEventPayload.merge(
          z.object({ updates: z.object({ previousRecord: record, record }).array() }),
        ),
      }),
    ),
    recordsBulkDeletedEvent,
  ])
}
