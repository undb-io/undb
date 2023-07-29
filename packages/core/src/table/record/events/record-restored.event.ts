import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'
import { queryRecordSchema } from '../record.type.js'
import { recordIdSchema } from '../value-objects/index.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_RESTORED = 'record.restored' as const

export const recordRestoredEventPayload = z
  .object({
    id: recordIdSchema,
    name: z.string(),
  })
  .merge(baseRecordEventSchema)

type IRecordRestoredEventPayload = z.infer<typeof recordRestoredEventPayload>

export const recordRestoredEventMeta = z.object({
  record: queryRecordSchema,
})

export type IRecordRestoredEventMeta = z.infer<typeof recordRestoredEventMeta>

export const recordRestoredEvent = z
  .object({ name: z.literal(EVT_RECORD_RESTORED), payload: recordRestoredEventPayload, meta: recordRestoredEventMeta })
  .merge(baseEventSchema)

export class RecordRestoredEvent extends BaseEvent<
  IRecordRestoredEventPayload,
  BaseRecordEventName,
  IRecordRestoredEventMeta
> {
  public readonly name = EVT_RECORD_RESTORED

  static from(table: Table, operatorId: string, record: Record): RecordRestoredEvent {
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
