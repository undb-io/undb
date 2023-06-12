import { BaseEvent } from '@undb/domain'
import type { Table } from '../../table'
import type { BaseRecordEventName, IBaseRecordEventPayload } from './base-record.event'

export const EVT_RECORD_DELETED: BaseRecordEventName = 'record.deleted'

interface IRecordDeletedEventPayload extends IBaseRecordEventPayload {
  id: string
}

export class RecordDeletedEvent extends BaseEvent<IRecordDeletedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_DELETED

  static from(table: Table, id: string): RecordDeletedEvent {
    return new this({
      id,
      tableId: table.id.value,
      tableName: table.name.value,
    })
  }
}
