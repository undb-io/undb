import { describe, expect, test } from 'bun:test'
import { Schema } from '../schema'
import type { IFilterGroup } from './filter.type'
import { getSpec } from './filter.util'

const schema = Schema.fromJSON([
  { id: 'field1', type: 'string', name: 'field1' },
  { id: 'field2', type: 'number', name: 'field2' },
])

describe('filter.util', () => {
  test.each<IFilterGroup>([
    {
      conjunction: 'and',
      children: [
        { fieldId: 'field1', op: 'eq', value: 'value1' },
        { fieldId: 'field2', op: 'gt', value: 1 },
      ],
    },
    {
      conjunction: 'or',
      children: [
        { fieldId: 'field1', op: 'eq', value: 'value1' },
        {
          conjunction: 'and',
          children: [
            { fieldId: 'field1', op: 'eq', value: 'value1' },
            { fieldId: 'field2', op: 'gt', value: 1 },
          ],
        },
        {
          conjunction: 'or',
          children: [
            { fieldId: 'field1', op: 'eq', value: 'value2' },
            { fieldId: 'field2', op: 'lt', value: 2 },
          ],
        },
      ],
    },
  ])('should get correct spec', (filter) => {
    const spec = getSpec(schema.fieldMapById, filter)
    expect(spec).toMatchSnapshot()
  })
})
