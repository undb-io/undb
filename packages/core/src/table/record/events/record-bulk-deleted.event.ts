import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import { RecordFactory } from '../record.factory.js'
import type { IQueryRecordSchema } from '../record.type.js'
import { recordIdSchema } from '../value-objects/record-id.schema.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_BULK_DELETED = 'record.bulk_deleted' as const

export const recordsBulkDeletedEventPayload = z
  .object({
    records: z
      .object({
        id: recordIdSchema,
        name: z.string(),
      })
      .array(),
  })
  .merge(baseRecordEventSchema)

type IRecordsBulkDeletedEventPayload = z.infer<typeof recordsBulkDeletedEventPayload>

export const recordsBulkDeletedEvent = z
  .object({ name: z.literal(EVT_RECORD_BULK_DELETED), payload: recordsBulkDeletedEventPayload })
  .merge(baseEventSchema)

export class RecordBulkDeletedEvent extends BaseEvent<IRecordsBulkDeletedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_BULK_DELETED

  static from(table: Table, operatorId: string, records: IQueryRecordSchema[]): RecordBulkDeletedEvent {
    const drs = RecordFactory.fromQueryRecords(records, table.schema.toIdMap())
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        records: drs.map((r) => ({
          id: r.id.value,
          name: r.getDisplayFieldsValue(table),
        })),
      },
      operatorId,
    )
  }
}
