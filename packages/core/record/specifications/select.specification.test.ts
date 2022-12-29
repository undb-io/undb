import { createTestRecord } from '../fixtures'
import { SelectEqual, SelectIn } from './select.specification'

test('should create with select value', () => {
  const spec = new SelectEqual('hello', { id: 'world', name: 'world' })
  const record = createTestRecord(spec)
  expect(record.values.value.size).toBe(1)
  expect(record.values.value).toMatchInlineSnapshot(`
    Map {
      "hello" => SelectFieldValue {
        "props": {
          "id": "world",
          "name": "world",
        },
      },
    }
  `)
})

test.each<[SelectEqual, SelectEqual, boolean]>([
  [
    new SelectEqual('hello', { id: 'world', name: 'world' }),
    new SelectEqual('hello', { id: 'world', name: 'world' }),
    true,
  ],
  [
    new SelectEqual('hello', { id: 'world', name: 'world' }),
    new SelectEqual('hello', { id: 'wor', name: 'worl' }),
    false,
  ],
])('should match SelectEqual', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[SelectIn, SelectEqual, boolean]>([
  [new SelectIn('hello', [{ id: 'id', name: 'world' }]), new SelectEqual('hello', { id: 'id', name: 'world' }), true],
  [new SelectIn('hello', [{ id: 'id', name: 'w' }]), new SelectEqual('hello', { id: 'id2', name: 'world' }), false],
])('should match SelectIn', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
