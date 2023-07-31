import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import { baseSchemaEventSchema } from '../../field/field.type.js'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import { queryRecordSchema } from '../record.type.js'
import { recordIdSchema } from '../value-objects/record-id.schema.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_CREATED = 'record.created' as const

export const recordCreatedEventPayload = z
  .object({
    id: recordIdSchema,
    record: recordReadableSchema,
    schema: baseSchemaEventSchema,
  })
  .merge(baseRecordEventSchema)

type IRecordCreatedEventPayload = z.infer<typeof recordCreatedEventPayload>

export const recordCreatedEventMeta = z.object({
  record: queryRecordSchema,
})

export type IRecordCreatedEventMeta = z.infer<typeof recordCreatedEventMeta>

export const recordCreatedEvent = z
  .object({ name: z.literal(EVT_RECORD_CREATED), payload: recordCreatedEventPayload, meta: recordCreatedEventMeta })
  .merge(baseEventSchema)

export class RecordCreatedEvent extends BaseEvent<
  IRecordCreatedEventPayload,
  BaseRecordEventName,
  IRecordCreatedEventMeta
> {
  public readonly name = EVT_RECORD_CREATED

  static from(table: Table, operatorId: string, record: Record): RecordCreatedEvent {
    const recordValues = recordReadableMapper(table.schema.fields, record)
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        id: record.id.value,
        record: recordValues,
        schema: table.schema.toEvent([record]),
      },
      operatorId,
      {
        record: record.toQuery(table.id.value),
      },
    )
  }
}
