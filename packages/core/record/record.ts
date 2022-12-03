import type { ICreateRecordInput } from '../commands'
import { RecordId } from './value-objects'

export class Record {
  public id: RecordId

  constructor(id = RecordId.create()) {
    this.id = id
  }

  static create(input: ICreateRecordInput): Record {
    return new Record(RecordId.fromOrCreate(input.id))
  }

  static unsafeCreate(input: ICreateRecordInput): Record {
    return new Record(RecordId.fromOrCreate(input.id))
  }
}
