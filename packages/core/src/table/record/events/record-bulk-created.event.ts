import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_BULK_CREATED = 'record.bulk_created' as const

export const recordsBulkCreatedEventPayload = z
  .object({
    records: recordReadableSchema.array(),
  })
  .merge(baseRecordEventSchema)

type IRecordsBulkCreatedEventPayload = z.infer<typeof recordsBulkCreatedEventPayload>

export const recordsBulkCreatedEvent = z
  .object({ name: z.literal(EVT_RECORD_BULK_CREATED), payload: recordsBulkCreatedEventPayload })
  .merge(baseEventSchema)

export class RecordBulkCreatedEvent extends BaseEvent<IRecordsBulkCreatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_BULK_CREATED

  static from(table: Table, operatorId: string, records: IQueryRecordSchema[]): RecordBulkCreatedEvent {
    const fields = table.schema.fields
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        records: records.map((r) => recordReadableMapper(fields, r)),
      },
      operatorId,
    )
  }
}
