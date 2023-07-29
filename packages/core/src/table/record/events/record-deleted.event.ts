import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'
import { queryRecordSchema } from '../record.type.js'
import { recordIdSchema } from '../value-objects/index.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_DELETED = 'record.deleted' as const

export const recordDeletedEventPayload = z
  .object({
    id: recordIdSchema,
    name: z.string(),
  })
  .merge(baseRecordEventSchema)

type IRecordDeletedEventPayload = z.infer<typeof recordDeletedEventPayload>

export const recordDeletedEventMeta = z.object({
  record: queryRecordSchema,
})

export type IRecordDeletedEventMeta = z.infer<typeof recordDeletedEventMeta>

export const recordDeletedEvent = z
  .object({ name: z.literal(EVT_RECORD_DELETED), payload: recordDeletedEventPayload, meta: recordDeletedEventMeta })
  .merge(baseEventSchema)

export class RecordDeletedEvent extends BaseEvent<
  IRecordDeletedEventPayload,
  BaseRecordEventName,
  IRecordDeletedEventMeta
> {
  public readonly name = EVT_RECORD_DELETED

  static from(table: Table, operatorId: string, record: Record): RecordDeletedEvent {
    return new this(
      {
        id: record.id.value,
        tableId: table.id.value,
        tableName: table.name.value,
        name: record.getDisplayFieldsValue(table),
      },
      operatorId,
      {
        record: record.toQuery(table.id.value),
      },
    )
  }
}
