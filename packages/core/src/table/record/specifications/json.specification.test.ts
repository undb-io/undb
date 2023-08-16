import { JsonFieldValue } from '../../field'
import { createTestRecord } from '../fixtures'
import { JsonEmpty, JsonEqual } from './json.specification'

const json = { hello: 'world' }

test('JsonEqual.mutate', () => {
  const value = new JsonFieldValue(json)
  const spec = new JsonEqual('name', value)
  const record = createTestRecord(spec)

  expect(record.values.value.get('name')).toMatchInlineSnapshot(`
    JsonFieldValue {
      "props": {
        "hello": "world",
      },
    }
  `)
})

test.each<[JsonEmpty, JsonEqual, boolean]>([
  [new JsonEmpty('name'), new JsonEqual('name', new JsonFieldValue(json)), false],
  [new JsonEmpty('name'), new JsonEqual('name', new JsonFieldValue({})), false],
  [new JsonEmpty('name'), new JsonEqual('name', new JsonFieldValue(null)), true],
])('JsonEmpty.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})
