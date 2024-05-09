import { ValueObject } from '@undb/domain'
import { RecordDO } from './record/record.do'

export class Records extends ValueObject {
  constructor(public readonly records: RecordDO[]) {
    super(records)
  }
}
