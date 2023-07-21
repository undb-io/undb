import { BaseEvent } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import { baseSchemaEventSchema } from '../../field/field.type.js'
import type { Table } from '../../table.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_UPDATED = 'record.updated' as const

export const recordUpdatedEventPayload = z
  .object({
    previousSchema: baseSchemaEventSchema.nullable(),
    previousRecord: recordReadableSchema,
    schema: baseSchemaEventSchema,
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
    previousTable: Option<Table>,
    operatorId: string,
    previousRecord: IQueryRecordSchema,
    record: IQueryRecordSchema,
  ): RecordUpdatedEvent {
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        previousSchema: previousTable.isSome() ? previousTable.unwrap().schema.toEvent([previousRecord]) : null,
        previousRecord: recordReadableMapper(table.schema.fields, previousRecord),
        schema: table.schema.toEvent([record]),
        record: recordReadableMapper(table.schema.fields, record),
      },
      operatorId,
    )
  }
}
