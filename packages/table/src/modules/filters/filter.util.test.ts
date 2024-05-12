import { describe, expect, test } from 'bun:test'
import { Schema } from '../schema'
import type { IFilterGroup, MaybeFilterGroup } from './filter.type'
import { getSpec, parseValidFilter } from './filter.util'

const schema = Schema.fromJSON([
  { id: 'fld_1', type: 'string', name: 'fld_1' },
  { id: 'fld_2', type: 'number', name: 'fld_2' },
])

describe('filter.util', () => {
  test.each<IFilterGroup>([
    {
      conjunction: 'and',
      children: [
        { fieldId: 'fld_1', op: 'eq', value: 'value1' },
        { fieldId: 'fld_2', op: 'gt', value: 1 },
      ],
    },
    {
      conjunction: 'or',
      children: [
        { fieldId: 'fld_1', op: 'eq', value: 'value1' },
        {
          conjunction: 'and',
          children: [
            { fieldId: 'fld_1', op: 'eq', value: 'value1' },
            { fieldId: 'fld_2', op: 'gt', value: 1 },
          ],
        },
        {
          conjunction: 'or',
          children: [
            { fieldId: 'fld_1', op: 'eq', value: 'value2' },
            { fieldId: 'fld_2', op: 'lt', value: 2 },
          ],
        },
      ],
    },
  ])('should get correct spec', (filter) => {
    const spec = getSpec(schema.fieldMapById, filter)
    expect(spec).toMatchSnapshot()
  })

  describe('parseValidFilter', () => {
    test.each<IFilterGroup>([
      {
        conjunction: 'and',
        children: [
          { fieldId: 'fld_1', op: 'eq', value: 'value1' },
          { fieldId: 'fld_2', op: 'gt', value: 1 },
        ],
      },
      {
        conjunction: 'or',
        children: [
          { fieldId: 'fld_1', op: 'eq', value: 'value1' },
          {
            conjunction: 'and',
            children: [
              { fieldId: 'fld_1', op: 'eq', value: 'value1' },
              { fieldId: 'fld_2', op: 'gt', value: 1 },
            ],
          },
          {
            conjunction: 'or',
            children: [
              { fieldId: 'fld_1', op: 'eq', value: 'value2' },
              { fieldId: 'fld_2', op: 'lt', value: 2 },
            ],
          },
        ],
      },
    ])('should parse valid filter', (filter) => {
      const parsed = parseValidFilter(schema.fieldMapById, filter)
      expect(parsed).toEqual(filter)
    })

    test.each<[MaybeFilterGroup, IFilterGroup]>([
      [
        {
          conjunction: 'and',
          children: [
            { fieldId: 'fld_1', op: 'eq', value: 'value1' },
            { fieldId: 'fld_2', op: 'gt', value: '1' },
          ],
        },
        {
          conjunction: 'and',
          children: [{ fieldId: 'fld_1', op: 'eq', value: 'value1' }],
        },
      ],
      [
        {
          conjunction: 'or',
          children: [
            { fieldId: 'fld_1', op: 'eq', value: 'value1' },
            {
              conjunction: 'and',
              children: [
                { fieldId: 'fld_1', op: 'eq', value: 'value1' },
                { fieldId: 'fld_2', op: 'gt', value: '1' },
              ],
            },
            {
              conjunction: 'or',
              children: [
                { fieldId: 'fld_1', value: 'value2' },
                { fieldId: 'fld_2', op: 'lt', value: 2 },
              ],
            },
          ],
        },
        {
          conjunction: 'or',
          children: [
            { fieldId: 'fld_1', op: 'eq', value: 'value1' },
            {
              conjunction: 'and',
              children: [{ fieldId: 'fld_1', op: 'eq', value: 'value1' }],
            },
            {
              conjunction: 'or',
              children: [{ fieldId: 'fld_2', op: 'lt', value: 2 }],
            },
          ],
        },
      ],
    ])('should ignore invalid filter', (filter, value) => {
      const parsed = parseValidFilter(schema.fieldMapById, filter)
      expect(parsed).toEqual(value)
    })
  })
})
