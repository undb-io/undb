import type { TableId } from '../value-objects'
import type { ICreateRecordInput_internal } from './record.type'
import { RecordId } from './value-objects'
import { RecordValue } from './value-objects/record-value.vo'

export class Record {
  public id: RecordId
  public tableId: TableId
  public value: RecordValue

  constructor(id = RecordId.create(), tableId: TableId, value: RecordValue) {
    this.id = id
    this.tableId = tableId
    this.value = value
  }

  static create(input: ICreateRecordInput_internal): Record {
    return new Record(RecordId.fromOrCreate(input.id), input.tableId, RecordValue.fromArray(input.value))
  }

  static unsafeCreate(input: ICreateRecordInput_internal): Record {
    return new Record(RecordId.fromOrCreate(input.id), input.tableId, RecordValue.fromArray(input.value))
  }
}
