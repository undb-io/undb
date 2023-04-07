import { RecordFactory } from '../record.factory.js'
import { WithRecordId, WithRecordTableId } from '../specifications/index.js'
import type { RecordCompositeSpecification } from '../specifications/interface.js'

export const createTestRecord = (...specs: RecordCompositeSpecification[]) => {
  let spec = WithRecordTableId.fromString('tableId').unwrap().and(WithRecordId.fromString('record'))
  for (const s of specs) {
    spec = spec.and(s)
  }

  return RecordFactory.create(spec).unwrap()
}
