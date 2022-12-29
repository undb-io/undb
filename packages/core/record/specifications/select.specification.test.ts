import { createTestRecord } from '../fixtures'
import { SelectEqual, SelectIn } from './select.specification'

test('should create with select value', () => {
  const spec = new SelectEqual('hello', 'world')
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
  [new SelectEqual('hello', 'world'), new SelectEqual('hello', 'world'), true],
  [new SelectEqual('hello', 'world'), new SelectEqual('hello', 'wor'), false],
])('should match SelectEqual', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[SelectIn, SelectEqual, boolean]>([
  [new SelectIn('hello', ['id']), new SelectEqual('hello', 'id'), true],
  [new SelectIn('hello', ['id']), new SelectEqual('hello', 'id2'), false],
])('should match SelectIn', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
