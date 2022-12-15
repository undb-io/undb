import { RecordFactory } from '../record.factory'
import { WithRecordId, WithRecordTableId } from '../specifications'
import type { RecordCompositeSpecification } from '../specifications/interface'

export const createTestRecord = (...specs: RecordCompositeSpecification[]) => {
  let spec = WithRecordTableId.fromString('tableId').unwrap().and(WithRecordId.fromString('record'))
  for (const s of specs) {
    spec = spec.and(s)
  }

  return RecordFactory.create(spec).unwrap()
}
