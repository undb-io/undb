import { BaseEvent } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import { baseSchemaEventSchema } from '../../field/field.type.js'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import { queryRecordSchema } from '../record.type.js'
import { recordIdSchema } from '../value-objects/record-id.schema.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_UPDATED = 'record.updated' as const

export const recordUpdatedEventPayload = z
  .object({
    id: recordIdSchema,
    previousSchema: baseSchemaEventSchema.nullable(),
    previousRecord: recordReadableSchema,
    schema: baseSchemaEventSchema,
    record: recordReadableSchema,
  })
  .merge(baseRecordEventSchema)

type IRecordUpdatedEventPayload = z.infer<typeof recordUpdatedEventPayload>

export const recordUpdatedEventMeta = z.object({
  record: queryRecordSchema,
})

export type IRecordUpdatedEventMeta = z.infer<typeof recordUpdatedEventMeta>

export const recordUpdatedEvent = z
  .object({
    name: z.literal(EVT_RECORD_UPDATED),
    payload: recordUpdatedEventPayload,
    meta: recordUpdatedEventMeta,
  })
  .merge(baseEventSchema)

export class RecordUpdatedEvent extends BaseEvent<
  IRecordUpdatedEventPayload,
  BaseRecordEventName,
  IRecordUpdatedEventMeta
> {
  public readonly name = EVT_RECORD_UPDATED

  static from(
    table: Table,
    previousTable: Option<Table>,
    operatorId: string,
    previousRecord: Record,
    record: Record,
    updatedFieldIds: Set<string>,
  ): RecordUpdatedEvent {
    const fields = table.schema.fields.filter((f) => updatedFieldIds.has(f.id.value))
    const fieldIds = new Set(fields.map((f) => f.id.value))
    return new this(
      {
        id: record.id.value,
        tableId: table.id.value,
        tableName: table.name.value,
        previousSchema: previousTable.isSome()
          ? previousTable
              .unwrap()
              .schema.fields.filter((f) => fieldIds.has(f.id.value))
              .map((f) => f.toEvent([previousRecord]))
          : null,
        previousRecord: recordReadableMapper(fields, previousRecord),
        schema: table.schema.fields
          .filter((f) => fieldIds.has(f.id.value))
          .map((f) => f.toEvent([record, previousRecord])),
        record: recordReadableMapper(fields, record),
      },
      operatorId,
      {
        record: record.toQuery(table.id.value),
      },
    )
  }
}
