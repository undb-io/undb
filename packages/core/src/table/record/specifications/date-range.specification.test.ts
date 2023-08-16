import { addDays, subDays } from 'date-fns'
import { DateRangeFieldValue } from '../../field'
import { createTestRecord } from '../fixtures'
import {
  DateRangeDateEqual,
  DateRangeDateGreaterThan,
  DateRangeDateGreaterThanOrEqual,
  DateRangeDateLessThan,
  DateRangeDateLessThanOrEqual,
  DateRangeEmpty,
  DateRangeEqual,
} from './date-range.specification'

const date1 = new Date(2019, 2, 2)
const date2 = new Date(2022, 2, 2)

const dateRangeValue = new DateRangeFieldValue([date1, date2])

test.each<[DateRangeEqual, DateRangeEqual, boolean]>([
  [new DateRangeEqual('name', dateRangeValue), new DateRangeEqual('name', dateRangeValue), true],
])('DateRangeEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateRangeEmpty, DateRangeEqual, boolean]>([
  [
    new DateRangeEmpty('name', new DateRangeFieldValue([null, null])),
    new DateRangeEqual('name', new DateRangeFieldValue([null, null])),
    true,
  ],
  [
    new DateRangeEmpty('name', new DateRangeFieldValue([date1, null])),
    new DateRangeEqual('name', new DateRangeFieldValue([null, null])),
    false,
  ],
  [
    new DateRangeEmpty('name', new DateRangeFieldValue([null, date2])),
    new DateRangeEqual('name', new DateRangeFieldValue([null, null])),
    false,
  ],
  [
    new DateRangeEmpty('name', new DateRangeFieldValue([date1, date2])),
    new DateRangeEqual('name', new DateRangeFieldValue([null, null])),
    false,
  ],
])('DateRangeEmpty.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateRangeDateEqual, DateRangeEqual, boolean]>([
  [new DateRangeDateEqual('start', 'name', date1), new DateRangeEqual('name', dateRangeValue), true],
  [
    new DateRangeDateEqual('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([date1, null])),
    true,
  ],
  [
    new DateRangeDateEqual('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([date1, addDays(date2, 1)])),
    true,
  ],
  [
    new DateRangeDateEqual('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([addDays(date1, 1), null])),
    false,
  ],
  [new DateRangeDateEqual('end', 'name', date2), new DateRangeEqual('name', dateRangeValue), true],
  [
    new DateRangeDateEqual('end', 'name', date2),
    new DateRangeEqual('name', new DateRangeFieldValue([null, date2])),
    true,
  ],
  [
    new DateRangeDateEqual('end', 'name', date2),
    new DateRangeEqual('name', new DateRangeFieldValue([addDays(date1, 1), date2])),
    true,
  ],
  [
    new DateRangeDateEqual('end', 'name', date2),
    new DateRangeEqual('name', new DateRangeFieldValue([null, addDays(date2, 1)])),
    false,
  ],
])('DateRangeDateEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateRangeDateGreaterThan, DateRangeEqual, boolean]>([
  [new DateRangeDateGreaterThan('start', 'name', date1), new DateRangeEqual('name', dateRangeValue), false],
  [
    new DateRangeDateGreaterThan('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([addDays(date1, 1), null])),
    true,
  ],
  [
    new DateRangeDateGreaterThan('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([subDays(date1, 1), null])),
    false,
  ],
])('DateRangeDateGreaterThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateRangeDateLessThan, DateRangeEqual, boolean]>([
  [new DateRangeDateLessThan('start', 'name', date1), new DateRangeEqual('name', dateRangeValue), false],
  [
    new DateRangeDateLessThan('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([addDays(date1, 1), null])),
    false,
  ],
  [
    new DateRangeDateLessThan('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([subDays(date1, 1), null])),
    true,
  ],
])('DateRangeDateLessThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateRangeDateGreaterThanOrEqual, DateRangeEqual, boolean]>([
  [new DateRangeDateGreaterThanOrEqual('start', 'name', date1), new DateRangeEqual('name', dateRangeValue), true],
  [
    new DateRangeDateGreaterThanOrEqual('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([addDays(date1, 1), null])),
    true,
  ],
  [
    new DateRangeDateGreaterThanOrEqual('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([subDays(date1, 1), null])),
    false,
  ],
])('DateRangeDateGreaterThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateRangeDateLessThanOrEqual, DateRangeEqual, boolean]>([
  [new DateRangeDateLessThanOrEqual('start', 'name', date1), new DateRangeEqual('name', dateRangeValue), true],
  [
    new DateRangeDateLessThanOrEqual('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([addDays(date1, 1), null])),
    false,
  ],
  [
    new DateRangeDateLessThanOrEqual('start', 'name', date1),
    new DateRangeEqual('name', new DateRangeFieldValue([subDays(date1, 1), null])),
    true,
  ],
])('DateRangeDateLessThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
