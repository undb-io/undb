import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import { recordIdSchema } from '../value-objects/record-id.schema.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_BULK_DELETED = 'record.bulk_deleted' as const

export const recordsBulkDeletedEventPayload = z
  .object({
    ids: recordIdSchema.array(),
  })
  .merge(baseRecordEventSchema)

type IRecordsBulkDeletedEventPayload = z.infer<typeof recordsBulkDeletedEventPayload>

export const recordsBulkDeletedEvent = z
  .object({ name: z.literal(EVT_RECORD_BULK_DELETED), payload: recordsBulkDeletedEventPayload })
  .merge(baseEventSchema)

export class RecordBulkDeletedEvent extends BaseEvent<IRecordsBulkDeletedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_BULK_DELETED

  static from(table: Table, operatorId: string, ids: string[]): RecordBulkDeletedEvent {
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        ids,
      },
      operatorId,
    )
  }
}
