import { BaseEvent } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import { baseSchemaEventSchema } from '../../field/field.type.js'
import type { Table } from '../../table.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import { queryRecordSchema, type Records } from '../record.type.js'
import { recordIdSchema } from '../value-objects/record-id.schema.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_BULK_UPDATED = 'record.bulk_updated' as const

export const recordsBulkUpdatedEventPayload = z
  .object({
    previousSchema: baseSchemaEventSchema.nullable(),
    schema: baseSchemaEventSchema,
    updates: z
      .object({
        id: recordIdSchema,
        previousRecord: recordReadableSchema,
        record: recordReadableSchema,
      })
      .array(),
  })
  .merge(baseRecordEventSchema)

type IRecordsBulkUpdatedEventPayload = z.infer<typeof recordsBulkUpdatedEventPayload>

export const recordBulkUpdatedEventMeta = z.object({
  records: z.record(recordIdSchema, queryRecordSchema),
})

export type IRecordBulkUpdatedEventMeta = z.infer<typeof recordBulkUpdatedEventMeta>

export const recordsBulkUpdatedEvent = z
  .object({
    name: z.literal(EVT_RECORD_BULK_UPDATED),
    payload: recordsBulkUpdatedEventPayload,
    meta: recordBulkUpdatedEventMeta,
  })
  .merge(baseEventSchema)

export class RecordBulkUpdatedEvent extends BaseEvent<
  IRecordsBulkUpdatedEventPayload,
  BaseRecordEventName,
  IRecordBulkUpdatedEventMeta
> {
  public readonly name = EVT_RECORD_BULK_UPDATED

  static from(
    table: Table,
    previousTable: Option<Table>,
    operatorId: string,
    previousRecords: Records,
    records: Records,
    updatedFieldIds: Map<string, Set<string>>,
  ): RecordBulkUpdatedEvent {
    const recordsMap = new Map(records.map((r) => [r.id, r]))
    const fieldIds = new Set([...updatedFieldIds.values()].flatMap((f) => [...f.values()]))
    const schema = table.schema.fields
      .filter((f) => fieldIds.has(f.id.value))
      .map((f) => f.toEvent(records.concat(previousRecords)))
    const previousSchema = previousTable.isSome()
      ? previousTable
          .unwrap()
          .schema.fields.filter((f) => fieldIds.has(f.id.value))
          .map((f) => f.toEvent(previousRecords))
      : null
    return new this(
      {
        schema,
        previousSchema,
        tableId: table.id.value,
        tableName: table.name.value,
        updates: previousRecords.map((r) => {
          const fields = table.schema.fields.filter((f) => !!updatedFieldIds.get(r.id.value)?.has(f.id.value))
          return {
            id: r.id.value,
            previousRecord: recordReadableMapper(fields, r),
            record: recordReadableMapper(fields, recordsMap.get(r.id)!),
          }
        }),
      },
      operatorId,
      {
        records: records.reduce(
          (prev, curr) => {
            prev[curr.id.value] = curr.toQuery(table.id.value)
            return prev
          },
          {} as IRecordBulkUpdatedEventMeta['records'],
        ),
      },
    )
  }
}
