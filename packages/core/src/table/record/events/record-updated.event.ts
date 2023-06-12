import { BaseEvent } from '@undb/domain'
import type { Table } from '../../table.js'
import type { IRecordReadable } from '../record.readable.js'
import { recordReadableMapper } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import type { BaseRecordEventName, IBaseRecordEventPayload } from './base-record.event.js'

export const EVT_RECORD_UPDATED: BaseRecordEventName = 'record.updated'

interface IRecordUpdatedEventPayload extends IBaseRecordEventPayload {
  previousRecord: IRecordReadable
  record: IRecordReadable
}

export class RecordUpdatedEvent extends BaseEvent<IRecordUpdatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_UPDATED

  static from(
    table: Table,
    operatorId: string,
    previousRecord: IQueryRecordSchema,
    record: IQueryRecordSchema,
  ): RecordUpdatedEvent {
    return new this(
      {
        tableId: table.id.value,
        tableName: table.name.value,
        previousRecord: recordReadableMapper(table.schema.fields, previousRecord),
        record: recordReadableMapper(table.schema.fields, record),
      },
      operatorId,
    )
  }
}
