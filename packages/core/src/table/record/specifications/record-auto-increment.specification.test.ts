import { createTestRecord } from '../fixtures'
import { WithRecordAutoIncrement } from './record-auto-increment.specification'

test('WithRecordAutoIncrement.mutate', () => {
  const spec = new WithRecordAutoIncrement(7)
  const record = createTestRecord(spec)

  expect(record.autoIncrement).toBe(7)
})

test.each<[WithRecordAutoIncrement, WithRecordAutoIncrement, boolean]>([
  [new WithRecordAutoIncrement(7), new WithRecordAutoIncrement(7), true],
  [new WithRecordAutoIncrement(8), new WithRecordAutoIncrement(7), false],
])('WithRecordAutoIncrement.mutate', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})
