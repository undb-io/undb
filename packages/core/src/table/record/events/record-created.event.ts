import { BaseEvent } from '@undb/domain'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'
import type { IBaseRecordEventPayload } from './base-record.event.js'

export const EVT_RECORD_CREATED = 'record.created'

interface IRecordCreatedEventPayload extends IBaseRecordEventPayload {
  // TODO: values type
  record: any
}

export class RecordCreatedEvent extends BaseEvent<IRecordCreatedEventPayload> {
  public readonly name = EVT_RECORD_CREATED

  static from(table: Table, record: Record): RecordCreatedEvent {
    return new this({ tableId: table.id.value, tableName: table.name.value, record: record.valuesJSON })
  }
}
