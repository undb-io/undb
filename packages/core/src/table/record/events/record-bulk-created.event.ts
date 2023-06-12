import { BaseEvent } from '@undb/domain'
import type { Table } from '../../table.js'
import { recordReadableMapper, type IRecordReadable } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import type { BaseRecordEventName, IBaseRecordEventPayload } from './base-record.event.js'

export const EVT_RECORD_BULK_CREATED: BaseRecordEventName = 'record.bulk_created'

interface IRecordBulkCreatedEventPayload extends IBaseRecordEventPayload {
  records: IRecordReadable[]
}

export class RecordBulkCreatedEvent extends BaseEvent<IRecordBulkCreatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_BULK_CREATED

  static from(table: Table, operatorId: string, records: IQueryRecordSchema[]): RecordBulkCreatedEvent {
    const fields = table.schema.fields
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        records: records.map((r) => recordReadableMapper(fields, r)),
      },
      operatorId,
    )
  }
}
