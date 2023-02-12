import { createTestRecord } from '../fixtures/index.js'
import { BoolIsFalse, BoolIsTrue } from './bool.specification.js'

test.each<[BoolIsTrue, BoolIsTrue | BoolIsFalse, boolean]>([
  [new BoolIsTrue('name'), new BoolIsTrue('name'), true],
  [new BoolIsTrue('name'), new BoolIsFalse('name'), false],
])('BoolIsTrue.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[BoolIsFalse, BoolIsTrue | BoolIsFalse, boolean]>([
  [new BoolIsFalse('name'), new BoolIsFalse('name'), true],
  [new BoolIsFalse('name'), new BoolIsTrue('name'), false],
])('BoolIsFalse.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
