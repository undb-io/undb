import { RecordFactory } from '../record.factory.js'
import { WithRecordCreatedAt, WithRecordId, WithRecordTableId, WithRecordUpdatedAt } from '../specifications/index.js'
import type { RecordCompositeSpecification } from '../specifications/interface.js'

const date = new Date(2022, 1, 1)

export const createTestRecord = (...specs: RecordCompositeSpecification[]) => {
  let spec = WithRecordTableId.fromString('tableId')
    .unwrap()
    .and(WithRecordId.fromString('record'))
    .and(WithRecordCreatedAt.fromDate(date))
    .and(WithRecordUpdatedAt.fromDate(date))
  for (const s of specs) {
    spec = spec.and(s)
  }

  return RecordFactory.create(spec).unwrap()
}
