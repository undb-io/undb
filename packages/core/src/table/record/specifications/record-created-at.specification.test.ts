import { addDays } from 'date-fns'
import { createTestRecord } from '../fixtures'
import { WithRecordCreatedAt } from './record-created-at.specification'

const date = new Date(2019, 2, 2)

test('WithRecordCreatedAt.mutate', () => {
  const spec = WithRecordCreatedAt.fromDate(date)
  const record = createTestRecord(spec)
  expect(record.createdAt).toMatchInlineSnapshot(`
    r {
      "props": {
        "value": 2019-03-02T00:00:00.000Z,
      },
    }
  `)
})
test.each<[WithRecordCreatedAt, WithRecordCreatedAt, boolean]>([
  [WithRecordCreatedAt.fromDate(date), WithRecordCreatedAt.fromDate(date), true],
  [WithRecordCreatedAt.fromDate(addDays(date, 1)), WithRecordCreatedAt.fromDate(date), false],
])('WithRecordCreatedAt.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})
