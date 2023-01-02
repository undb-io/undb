import { addMilliseconds } from 'date-fns'
import { SafeParseError } from 'zod'
import { dateRangeFieldValue, IDateRangeFieldValue } from './date-range-field.type'

const now = new Date()

test.each<[IDateRangeFieldValue, boolean]>([
  [{ from: now, to: addMilliseconds(now, 1) }, false],
  [{ from: now, to: addMilliseconds(now, -1) }, true],
  [{ from: now, to: now }, true],
  [null, false],
])('dateRangeFieldValue', (data, expectError) => {
  const result = dateRangeFieldValue.safeParse(data)

  if (!expectError) {
    expect(result.success).toBe(true)
  } else {
    expect((result as SafeParseError<boolean>).error).toMatchSnapshot()
  }
})
