import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_UPDATED = 'record.updated' as const

export const recordUpdatedEventPayload = z
  .object({
    previousRecord: recordReadableSchema,
    record: recordReadableSchema,
  })
  .merge(baseRecordEventSchema)

type IRecordUpdatedEventPayload = z.infer<typeof recordUpdatedEventPayload>

export const recordUpdatedEvent = z
  .object({ name: z.literal(EVT_RECORD_UPDATED), payload: recordUpdatedEventPayload })
  .merge(baseEventSchema)

export class RecordUpdatedEvent extends BaseEvent<IRecordUpdatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_UPDATED

  static from(
    table: Table,
    operatorId: string,
    previousRecord: IQueryRecordSchema,
    record: IQueryRecordSchema,
  ): RecordUpdatedEvent {
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        previousRecord: recordReadableMapper(table.schema.fields, previousRecord),
        record: recordReadableMapper(table.schema.fields, record),
      },
      operatorId,
    )
  }
}
