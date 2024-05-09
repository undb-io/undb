import type { Option } from '@undb/domain'
import type { RecordComositeSpecification } from './record.composite-specification'

export interface IRecordRepository {
  find(spec: Option<RecordComositeSpecification>): void
}
