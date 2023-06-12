import type { IEvent } from '@undb/domain'
import type { JsonObject } from 'type-fest'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'

export class RecordCreatedEvent implements IEvent {
  public readonly name = 'record.created'

  constructor(public readonly table: Table, public readonly recordId: string, public readonly payload: JsonObject) {}

  static from(table: Table, record: Record): RecordCreatedEvent {
    return new this(table, record.id.value, record.valuesJSON)
  }
}
