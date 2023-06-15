import { BaseEvent } from '@undb/domain'
import type { Table } from '../../table.js'
import { recordReadableMapper, type IRecordReadable } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import type { BaseRecordEventName, IBaseRecordEventPayload } from './base-record.event.js'

export const EVT_RECORD_BULK_UPDATED = 'record.bulk_updated' as const

interface IRecordBulkUpdatedEventPayload extends IBaseRecordEventPayload {
  updates: { previousRecord: IRecordReadable; record: IRecordReadable }[]
}

export class RecordBulkUpdatedEvent extends BaseEvent<IRecordBulkUpdatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_BULK_UPDATED

  static from(
    table: Table,
    operatorId: string,
    previousRecords: IQueryRecordSchema[],
    records: IQueryRecordSchema[],
  ): RecordBulkUpdatedEvent {
    const fields = table.schema.fields
    const recordsMap = new Map(records.map((r) => [r.id, r]))
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        updates: previousRecords.map((r) => ({
          previousRecord: recordReadableMapper(fields, r),
          record: recordReadableMapper(fields, recordsMap.get(r.id)!),
        })),
      },
      operatorId,
    )
  }
}
