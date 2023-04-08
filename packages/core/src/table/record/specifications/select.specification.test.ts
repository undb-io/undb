import { SelectFieldValue } from '../../field/index.js'
import { createTestRecord } from '../fixtures/index.js'
import { SelectEqual, SelectIn } from './select.specification.js'

test('should create with select value', () => {
  const spec = new SelectEqual('hello', new SelectFieldValue('world'))
  const record = createTestRecord(spec)
  expect(record.values.value.size).toBe(1)
  expect(record.values.value).toMatchInlineSnapshot(`
    Map {
      "hello" => SelectFieldValue {
        "props": {
          "value": "world",
        },
      },
    }
  `)
})

test.each<[SelectEqual, SelectEqual, boolean]>([
  [
    new SelectEqual('hello', new SelectFieldValue('world')),
    new SelectEqual('hello', new SelectFieldValue('world')),
    true,
  ],
  [
    new SelectEqual('hello', new SelectFieldValue('world')),
    new SelectEqual('hello', new SelectFieldValue('wor')),
    false,
  ],
])('should match SelectEqual', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[SelectIn, SelectEqual, boolean]>([
  [new SelectIn('hello', [new SelectFieldValue('id')]), new SelectEqual('hello', new SelectFieldValue('id')), true],
  [new SelectIn('hello', [new SelectFieldValue('id')]), new SelectEqual('hello', new SelectFieldValue('id2')), false],
])('should match SelectIn', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
