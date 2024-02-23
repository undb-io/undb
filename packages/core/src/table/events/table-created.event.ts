import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import { Table } from '../table.js'
import { tableIdSchema } from '../value-objects/index.js'
import { BaseTableEventName } from './base-table.event.js'

export const EVT_TABLE_CREATED = 'table.created' as const

export const tableCreatedEventPayload = z.object({
  id: tableIdSchema,
})

type ITableCreatedEventPayload = z.infer<typeof tableCreatedEventPayload>

export class TableCreatedEvent extends BaseEvent<ITableCreatedEventPayload, BaseTableEventName> {
  public readonly name = EVT_TABLE_CREATED

  static from(table: Table, operatorId: string): TableCreatedEvent {
    return new this({ id: table.id.value }, operatorId, undefined)
  }
}
