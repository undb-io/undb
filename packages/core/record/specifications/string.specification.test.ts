import { createTestRecord } from '../fixtures'
import { StringContain, StringEndsWith, StringEqual, StringRegex, StringStartsWith } from './string.specification'

test.each<[StringContain, StringEqual, boolean]>([
  [new StringContain('hello', 'world'), new StringEqual('hello', 'world111'), true],
  [new StringContain('hello', 'world'), new StringEqual('hello', 'wor'), false],
  [new StringContain('hello', 'world'), new StringEqual('hello', 'world'), true],
  [new StringContain('hello', 'world'), new StringEqual('hello1', 'world'), false],
])('should match StringContains', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringEqual, StringEqual, boolean]>([
  [new StringEqual('hello', 'world'), new StringEqual('hello', 'world111'), false],
  [new StringEqual('hello', 'world'), new StringEqual('hello', 'world'), true],
])('should match StringEqual', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringStartsWith, StringEqual, boolean]>([
  [new StringStartsWith('hello', 'world'), new StringEqual('hello', 'world111'), true],
  [new StringStartsWith('hello', 'world'), new StringEqual('hello', '111world'), false],
])('should match StringStartsWith', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringEndsWith, StringEqual, boolean]>([
  [new StringEndsWith('hello', 'world'), new StringEqual('hello', 'world111'), false],
  [new StringEndsWith('hello', 'world'), new StringEqual('hello', '111world'), true],
])('should match StringEndsWith', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringRegex, StringEqual, boolean]>([
  [new StringRegex('hello', '^wor'), new StringEqual('hello', 'world111'), true],
  [new StringRegex('hello', '11$'), new StringEqual('hello', 'world111'), true],
])('should match StringRegex', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
