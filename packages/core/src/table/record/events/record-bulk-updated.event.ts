import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_BULK_UPDATED = 'record.bulk_updated' as const

export const recordsBulkUpdatedEventPayload = z
  .object({
    updates: z
      .object({
        previousRecord: recordReadableSchema,
        record: recordReadableSchema,
      })
      .array(),
  })
  .merge(baseRecordEventSchema)

type IRecordsBulkUpdatedEventPayload = z.infer<typeof recordsBulkUpdatedEventPayload>

export const recordsBulkUpdatedEvent = z
  .object({ name: z.literal(EVT_RECORD_BULK_UPDATED), payload: recordsBulkUpdatedEventPayload })
  .merge(baseEventSchema)

export class RecordBulkUpdatedEvent extends BaseEvent<IRecordsBulkUpdatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_BULK_UPDATED

  static from(
    table: Table,
    operatorId: string,
    previousRecords: IQueryRecordSchema[],
    records: IQueryRecordSchema[],
  ): RecordBulkUpdatedEvent {
    const fields = table.schema.fields
    const recordsMap = new Map(records.map((r) => [r.id, r]))
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        updates: previousRecords.map((r) => ({
          previousRecord: recordReadableMapper(fields, r),
          record: recordReadableMapper(fields, recordsMap.get(r.id)!),
        })),
      },
      operatorId,
    )
  }
}
