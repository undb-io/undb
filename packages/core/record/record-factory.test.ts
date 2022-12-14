import { RecordFactory } from './record.factory'
import { WithRecordId, WithRecordTableId } from './specifications'
import { RecordCompositeSpecification } from './specifications/interface'

test.each<RecordCompositeSpecification>([
  WithRecordTableId.fromString('table').unwrap().and(WithRecordId.fromString('record')),
])('should create record', (spec) => {
  const record = RecordFactory.create(spec)

  expect(record).toMatchSnapshot()
})
