import { addDays, addHours, endOfDay, startOfDay, subDays } from 'date-fns'
import { DateFieldValue } from '../../field/index.js'
import { createTestRecord } from '../fixtures/index.js'
import {
  DateBetween,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
} from './date.specification.js'

const date = new Date(2022, 1, 1, 10)
const dateValue = new DateFieldValue(date)

test.each<[DateEqual, DateEqual, boolean]>([
  [new DateEqual('name', dateValue), new DateEqual('name', dateValue), true],
  [new DateEqual('name', dateValue), new DateEqual('name', new DateFieldValue(addDays(date, 1))), false],
  [new DateEqual('name', new DateFieldValue(addDays(date, 1))), new DateEqual('name', dateValue), false],
])('DateEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateGreaterThan, DateEqual, boolean]>([
  [new DateGreaterThan('name', new DateFieldValue(addDays(date, 1))), new DateEqual('name', dateValue), false],
  [new DateGreaterThan('name', dateValue), new DateEqual('name', new DateFieldValue(addDays(date, 1))), true],
])('DateGreaterThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateGreaterThanOrEqual, DateEqual, boolean]>([
  [new DateGreaterThanOrEqual('name', new DateFieldValue(addDays(date, 1))), new DateEqual('name', dateValue), false],
  [new DateGreaterThanOrEqual('name', dateValue), new DateEqual('name', new DateFieldValue(addDays(date, 1))), true],
  [new DateGreaterThanOrEqual('name', dateValue), new DateEqual('name', dateValue), true],
])('DateGreaterThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateLessThan, DateEqual, boolean]>([
  [new DateLessThan('name', new DateFieldValue(addDays(date, 1))), new DateEqual('name', dateValue), true],
  [new DateLessThan('name', dateValue), new DateEqual('name', new DateFieldValue(addDays(date, 1))), false],
])('DateLessThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateLessThanOrEqual, DateEqual, boolean]>([
  [new DateLessThanOrEqual('name', new DateFieldValue(addDays(date, 1))), new DateEqual('name', dateValue), true],
  [new DateLessThanOrEqual('name', dateValue), new DateEqual('name', new DateFieldValue(addDays(date, 1))), false],
  [new DateLessThanOrEqual('name', dateValue), new DateEqual('name', dateValue), true],
])('DateLessThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateIsToday, DateEqual, boolean]>([
  [new DateIsToday('name'), new DateEqual('name', dateValue), true],
  [new DateIsToday('name'), new DateEqual('name', new DateFieldValue(addDays(date, 1))), false],
  [new DateIsToday('name'), new DateEqual('name', new DateFieldValue(addHours(date, 1))), true],
  [new DateIsToday('name'), new DateEqual('name', new DateFieldValue(startOfDay(date))), true],
  [new DateIsToday('name'), new DateEqual('name', new DateFieldValue(endOfDay(date))), true],
])('DateLessThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  vi.setSystemTime(date)
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
  vi.useRealTimers()
})

test.each<[DateBetween, DateEqual, boolean]>([
  [new DateBetween('name', subDays(date, 1), addDays(date, 1)), new DateEqual('name', dateValue), true],
  [new DateBetween('name', addDays(date, 1), addDays(date, 2)), new DateEqual('name', dateValue), false],
])('DateBetween.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
