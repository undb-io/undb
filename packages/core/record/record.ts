import type { TableId } from '../value-objects'
import type { ICreateRecordInput_internal } from './record.type'
import { RecordId } from './value-objects'
import { RecordValues } from './value-objects/record-values.vo'

export class Record {
  public id: RecordId
  public tableId: TableId
  public values: RecordValues

  constructor(id = RecordId.create(), tableId: TableId, value: RecordValues) {
    this.id = id
    this.tableId = tableId
    this.values = value
  }

  static create(input: ICreateRecordInput_internal): Record {
    return new Record(RecordId.fromOrCreate(input.id), input.tableId, RecordValues.fromArray(input.value))
  }

  static unsafeCreate(input: ICreateRecordInput_internal): Record {
    return new Record(RecordId.fromOrCreate(input.id), input.tableId, RecordValues.fromArray(input.value))
  }
}
