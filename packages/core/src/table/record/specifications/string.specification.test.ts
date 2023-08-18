import { StringFieldValue } from '../../field/index.js'
import { createTestRecord } from '../fixtures/index.js'
import {
  StringContain,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
} from './string.specification.js'

test.each<[StringContain, StringEqual, boolean]>([
  [
    new StringContain('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('world111')),
    true,
  ],
  [
    new StringContain('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('wor')),
    false,
  ],
  [
    new StringContain('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('world')),
    true,
  ],
  [
    new StringContain('hello', new StringFieldValue('world')),
    new StringEqual('hello1', new StringFieldValue('world')),
    false,
  ],
])('should match StringContains', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringEqual, StringEqual, boolean]>([
  [
    new StringEqual('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('world111')),
    false,
  ],
  [
    new StringEqual('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('world')),
    true,
  ],
])('should match StringEqual', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringStartsWith, StringEqual, boolean]>([
  [
    new StringStartsWith('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('world111')),
    true,
  ],
  [
    new StringStartsWith('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('111world')),
    false,
  ],
])('should match StringStartsWith', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringEndsWith, StringEqual, boolean]>([
  [
    new StringEndsWith('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('world111')),
    false,
  ],
  [
    new StringEndsWith('hello', new StringFieldValue('world')),
    new StringEqual('hello', new StringFieldValue('111world')),
    true,
  ],
])('should match StringEndsWith', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringRegex, StringEqual, boolean]>([
  [
    new StringRegex('hello', new StringFieldValue('^wor')),
    new StringEqual('hello', new StringFieldValue('world111')),
    true,
  ],
  [
    new StringRegex('hello', new StringFieldValue('11$')),
    new StringEqual('hello', new StringFieldValue('world111')),
    true,
  ],
])('should match StringRegex', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[StringEmpty, StringEqual, boolean]>([
  [new StringEmpty('hello'), new StringEqual('hello', new StringFieldValue('world111')), false],
  [new StringEmpty('hello'), new StringEqual('hello', new StringFieldValue('')), true],
  [new StringEmpty('hello'), new StringEqual('hello', new StringFieldValue(null)), true],
])('should match StringEmpty', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
