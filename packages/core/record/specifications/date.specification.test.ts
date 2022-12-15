import { addDays } from 'date-fns'
import { createTestRecord } from '../fixtures'
import {
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateLessThan,
  DateLessThanOrEqual,
} from './date.specification'

const date = new Date(2022, 1, 1)

test.each<[DateEqual, DateEqual, boolean]>([
  [new DateEqual('name', date), new DateEqual('name', date), true],
  [new DateEqual('name', date), new DateEqual('name', addDays(date, 1)), false],
  [new DateEqual('name', addDays(date, 1)), new DateEqual('name', date), false],
])('DateEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateGreaterThan, DateEqual, boolean]>([
  [new DateGreaterThan('name', addDays(date, 1)), new DateEqual('name', date), false],
  [new DateGreaterThan('name', date), new DateEqual('name', addDays(date, 1)), true],
])('DateGreaterThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateGreaterThanOrEqual, DateEqual, boolean]>([
  [new DateGreaterThanOrEqual('name', addDays(date, 1)), new DateEqual('name', date), false],
  [new DateGreaterThanOrEqual('name', date), new DateEqual('name', addDays(date, 1)), true],
  [new DateGreaterThanOrEqual('name', date), new DateEqual('name', date), true],
])('DateGreaterThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateLessThan, DateEqual, boolean]>([
  [new DateLessThan('name', addDays(date, 1)), new DateEqual('name', date), true],
  [new DateLessThan('name', date), new DateEqual('name', addDays(date, 1)), false],
])('DateLessThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[DateLessThanOrEqual, DateEqual, boolean]>([
  [new DateLessThanOrEqual('name', addDays(date, 1)), new DateEqual('name', date), true],
  [new DateLessThanOrEqual('name', date), new DateEqual('name', addDays(date, 1)), false],
  [new DateLessThanOrEqual('name', date), new DateEqual('name', date), true],
])('DateLessThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
