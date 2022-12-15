import { DateVO } from '@egodb/domain'
import type { TableId } from '../value-objects'
import { RecordId, RecordValues } from './value-objects'

export class Record {
  public id: RecordId = RecordId.create()
  public tableId!: TableId
  public values: RecordValues = RecordValues.empty()
  public createdAt: DateVO = DateVO.now()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static create() {
    const record = new Record()

    return record
  }
}
