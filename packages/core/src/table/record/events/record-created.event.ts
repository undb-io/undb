import { BaseEvent } from '@undb/domain'
import type { Table } from '../../table.js'
import { recordReadableMapper } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import type { BaseRecordEventName, IBaseRecordEventPayload } from './base-record.event.js'

export const EVT_RECORD_CREATED: BaseRecordEventName = 'record.created'

interface IRecordCreatedEventPayload extends IBaseRecordEventPayload {
  // TODO: values type
  record: any
}

export class RecordCreatedEvent extends BaseEvent<IRecordCreatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_CREATED

  static from(table: Table, record: IQueryRecordSchema): RecordCreatedEvent {
    const recordValues = recordReadableMapper(table.schema.fields, record)
    return new this({ tableId: table.id.value, tableName: table.name.value, record: recordValues })
  }
}
