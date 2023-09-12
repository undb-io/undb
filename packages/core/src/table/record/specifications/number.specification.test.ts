import { NumberFieldValue } from '../../field'
import { createTestRecord } from '../fixtures'
import {
  NumberEmpty,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
} from './number.specification'

test('NumberEqual.mutation', () => {
  const value = new NumberEqual('name', new NumberFieldValue(7))
  const record = createTestRecord(value)

  expect(record.values.value.get('name')).toMatchInlineSnapshot(`
    NumberFieldValue {
      "props": {
        "value": 7,
      },
    }
  `)
})

test.each<[NumberEqual, NumberEqual, boolean]>([
  [new NumberEqual('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(7)), true],
  [new NumberEqual('name', new NumberFieldValue(null)), new NumberEqual('name', new NumberFieldValue(null)), true],
  [new NumberEqual('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(8)), false],
])('NumberEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[NumberGreaterThan, NumberEqual, boolean]>([
  [new NumberGreaterThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(8)), true],
  [new NumberGreaterThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(7)), false],
  [new NumberGreaterThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(6)), false],
  [new NumberGreaterThan('name', new NumberFieldValue(null)), new NumberEqual('name', new NumberFieldValue(6)), false],
  [new NumberGreaterThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(null)), true],
])('NumberGreaterThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[NumberLessThan, NumberEqual, boolean]>([
  [new NumberLessThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(8)), false],
  [new NumberLessThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(7)), false],
  [new NumberLessThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(6)), true],
  [new NumberLessThan('name', new NumberFieldValue(null)), new NumberEqual('name', new NumberFieldValue(6)), false],
  [new NumberLessThan('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(null)), false],
])('NumberLessThan.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[NumberGreaterThanOrEqual, NumberEqual, boolean]>([
  [
    new NumberGreaterThanOrEqual('name', new NumberFieldValue(7)),
    new NumberEqual('name', new NumberFieldValue(8)),
    true,
  ],
  [
    new NumberGreaterThanOrEqual('name', new NumberFieldValue(7)),
    new NumberEqual('name', new NumberFieldValue(7)),
    true,
  ],
  [
    new NumberGreaterThanOrEqual('name', new NumberFieldValue(7)),
    new NumberEqual('name', new NumberFieldValue(6)),
    false,
  ],
  [
    new NumberGreaterThanOrEqual('name', new NumberFieldValue(null)),
    new NumberEqual('name', new NumberFieldValue(6)),
    false,
  ],
  [
    new NumberGreaterThanOrEqual('name', new NumberFieldValue(7)),
    new NumberEqual('name', new NumberFieldValue(null)),
    true,
  ],
])('NumberGreaterThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[NumberLessThanOrEqual, NumberEqual, boolean]>([
  [new NumberLessThanOrEqual('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(8)), false],
  [new NumberLessThanOrEqual('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(7)), true],
  [new NumberLessThanOrEqual('name', new NumberFieldValue(7)), new NumberEqual('name', new NumberFieldValue(6)), true],
  [
    new NumberLessThanOrEqual('name', new NumberFieldValue(null)),
    new NumberEqual('name', new NumberFieldValue(6)),
    false,
  ],
  [
    new NumberLessThanOrEqual('name', new NumberFieldValue(7)),
    new NumberEqual('name', new NumberFieldValue(null)),
    false,
  ],
])('NumberLessThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[NumberEmpty, NumberEqual, boolean]>([
  [new NumberEmpty('name'), new NumberEqual('name', new NumberFieldValue(8)), false],
  [new NumberEmpty('name'), new NumberEqual('name', new NumberFieldValue(null)), true],
  [new NumberEmpty('name'), new NumberEqual('name', new NumberFieldValue(0)), false],
])('NumberLessThanOrEqual.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)

  expect(spec.isSatisfiedBy(record)).toBe(result)
})
