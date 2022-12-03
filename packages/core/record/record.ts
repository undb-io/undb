import type { ICreateRecordInput_internal } from './record.type'
import { RecordId } from './value-objects'
import { RecordValue } from './value-objects/record-value.vo'

export class Record {
  public id: RecordId
  public value: RecordValue

  constructor(id = RecordId.create(), value: RecordValue) {
    this.id = id
    this.value = value
  }

  static create(input: ICreateRecordInput_internal): Record {
    return new Record(RecordId.fromOrCreate(input.id), RecordValue.fromArray(input.value))
  }

  static unsafeCreate(input: ICreateRecordInput_internal): Record {
    return new Record(RecordId.fromOrCreate(input.id), RecordValue.fromArray(input.value))
  }
}
