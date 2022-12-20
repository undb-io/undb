import { createTestRecord } from '../fixtures'
import { SelectEqual, SelectIn } from './select.specification'

test('should create with select value', () => {
  const spec = new SelectEqual('hello', { name: 'world' })
  const record = createTestRecord(spec)
  expect(record.values.value.size).toBe(1)
  expect(record.values.value).toMatchInlineSnapshot(`
    Map {
      "hello" => SelectFieldValue {
        "props": {
          "name": "world",
        },
      },
    }
  `)
})

test.each<[SelectEqual, SelectEqual, boolean]>([
  [new SelectEqual('hello', { name: 'world' }), new SelectEqual('hello', { name: 'world' }), true],
  [new SelectEqual('hello', { name: 'world' }), new SelectEqual('hello', { name: 'worl' }), false],
])('should match SelectEqual', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[SelectIn, SelectEqual, boolean]>([
  [new SelectIn('hello', [{ name: 'world' }]), new SelectEqual('hello', { name: 'world' }), true],
  [new SelectIn('hello', [{ name: 'w' }]), new SelectEqual('hello', { name: 'world' }), false],
])('should match SelectEqual', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
