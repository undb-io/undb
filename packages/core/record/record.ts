import type { TableId } from '../value-objects'
import { RecordId } from './value-objects'
import { RecordValues } from './value-objects/record-values.vo'

export class Record {
  public id: RecordId = RecordId.create()
  public tableId!: TableId
  public values: RecordValues = RecordValues.empty()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static create() {
    const record = new Record()

    return record
  }
}
