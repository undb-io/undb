import type { IEvent } from '@undb/domain'
import type { JsonObject } from 'type-fest'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'

export const EVT_RECORD_CREATED = 'record.created'

export class RecordCreatedEvent implements IEvent {
  public readonly name = EVT_RECORD_CREATED

  constructor(public readonly payload: JsonObject) {}

  static from(table: Table, record: Record): RecordCreatedEvent {
    return new this(record.valuesJSON)
  }
}
