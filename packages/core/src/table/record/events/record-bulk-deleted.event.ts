import { BaseEvent } from '@undb/domain'
import type { Table } from '../../table.js'
import type { BaseRecordEventName, IBaseRecordEventPayload } from './base-record.event.js'

export const EVT_RECORD_BULK_DELETED: BaseRecordEventName = 'record.bulk_deleted'

interface IRecordBulkDeletedEventPayload extends IBaseRecordEventPayload {
  ids: string[]
}

export class RecordBulkDeletedEvent extends BaseEvent<IRecordBulkDeletedEventPayload, BaseRecordEventName> {
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
