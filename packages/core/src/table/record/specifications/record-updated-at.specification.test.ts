import { addDays } from 'date-fns'
import { createTestRecord } from '../fixtures'
import { WithRecordUpdatedAt } from './record-updated-at.specification'

const date = new Date(2019, 2, 2)

test('WithRecordUpdatedAt.mutate', () => {
  const spec = WithRecordUpdatedAt.fromDate(date)
  const record = createTestRecord(spec)
  expect(record.updatedAt).toMatchInlineSnapshot(`
    r {
      "props": {
        "value": 2019-03-02T00:00:00.000Z,
      },
    }
  `)
})
test.each<[WithRecordUpdatedAt, WithRecordUpdatedAt, boolean]>([
  [WithRecordUpdatedAt.fromDate(date), WithRecordUpdatedAt.fromDate(date), true],
  [WithRecordUpdatedAt.fromDate(addDays(date, 1)), WithRecordUpdatedAt.fromDate(date), false],
])('WithRecordUpdatedAt.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})
