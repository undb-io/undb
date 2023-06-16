import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import { recordIdSchema } from '../value-objects/index.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_DELETED = 'record.deleted' as const

export const recordDeletedEventPayload = z
  .object({
    id: recordIdSchema,
  })
  .merge(baseRecordEventSchema)

type IRecordDeletedEventPayload = z.infer<typeof recordDeletedEventPayload>

export const recordDeletedEvent = z
  .object({ name: z.literal(EVT_RECORD_DELETED), payload: recordDeletedEventPayload })
  .merge(baseEventSchema)

export class RecordDeletedEvent extends BaseEvent<IRecordDeletedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_DELETED

  static from(table: Table, operatorId: string, id: string): RecordDeletedEvent {
    return new this(
      {
        id,
        tableId: table.id.value,
        tableName: table.name.value,
      },
      operatorId,
    )
  }
}
