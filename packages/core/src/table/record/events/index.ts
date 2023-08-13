import { z } from 'zod'
import type { Table } from '../../table.js'
import { createRecordReadableValueSchema } from '../record.readable.js'
import { createQueryRecordSchema } from '../record.type.js'
import {
  EVT_RECORD_BULK_CREATED,
  RecordBulkCreatedEvent,
  recordsBulkCreatedEvent,
  recordsBulkCreatedEventMeta,
  recordsBulkCreatedEventPayload,
} from './record-bulk-created.event.js'
import {
  EVT_RECORD_BULK_DELETED,
  RecordBulkDeletedEvent,
  recordsBulkDeletedEvent,
  recordsBulkDeletedEventMeta,
} from './record-bulk-deleted.event.js'
import {
  EVT_RECORD_BULK_UPDATED,
  RecordBulkUpdatedEvent,
  recordBulkUpdatedEventMeta,
  recordsBulkUpdatedEvent,
  recordsBulkUpdatedEventPayload,
} from './record-bulk-updated.event.js'
import {
  EVT_RECORD_CREATED,
  RecordCreatedEvent,
  recordCreatedEvent,
  recordCreatedEventMeta,
  recordCreatedEventPayload,
} from './record-created.event.js'
import {
  EVT_RECORD_DELETED,
  RecordDeletedEvent,
  recordDeletedEvent,
  recordDeletedEventMeta,
} from './record-deleted.event.js'
import {
  EVT_RECORD_RESTORED,
  RecordRestoredEvent,
  recordRestoredEvent,
  recordRestoredEventMeta,
} from './record-restored.event.js'
import {
  EVT_RECORD_UPDATED,
  RecordUpdatedEvent,
  recordUpdatedEvent,
  recordUpdatedEventMeta,
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

export const recordEventNames = z.enum([
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_UPDATED,
  EVT_RECORD_RESTORED,
])

export type IRecordEventNames = z.infer<typeof recordEventNames>

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
  const queryRecord = createQueryRecordSchema(table)
  return z.discriminatedUnion('name', [
    recordCreatedEvent.merge(
      z.object({
        payload: recordCreatedEventPayload.merge(z.object({ record: record.partial() })),
        meta: recordCreatedEventMeta.merge(z.object({ record: queryRecord })),
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
        meta: recordUpdatedEventMeta.merge(z.object({ record: queryRecord })),
      }),
    ),
    recordDeletedEvent.merge(
      z.object({
        meta: recordDeletedEventMeta.merge(z.object({ record: queryRecord })),
      }),
    ),
    recordRestoredEvent.merge(
      z.object({
        meta: recordRestoredEventMeta.merge(z.object({ record: queryRecord })),
      }),
    ),
    recordsBulkCreatedEvent.merge(
      z.object({
        payload: recordsBulkCreatedEventPayload.merge(
          z.object({
            records: record.partial().array(),
          }),
        ),
        meta: recordsBulkCreatedEventMeta.merge(z.object({ records: queryRecord.array() })),
      }),
    ),
    recordsBulkUpdatedEvent.merge(
      z.object({
        payload: recordsBulkUpdatedEventPayload.merge(
          z.object({ updates: z.object({ previousRecord: record.partial(), record: record.partial() }).array() }),
        ),
        meta: recordBulkUpdatedEventMeta.merge(z.object({ records: queryRecord.array() })),
      }),
    ),
    recordsBulkDeletedEvent.merge(
      z.object({
        meta: recordsBulkDeletedEventMeta.merge(z.object({ records: queryRecord.array() })),
      }),
    ),
  ])
}
