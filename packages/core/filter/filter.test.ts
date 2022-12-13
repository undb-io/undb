import { convertFilterSpec, IRootFilter, rootFilter } from './filter'

test.each<IRootFilter>([
  {
    type: 'string',
    operator: '$eq',
    path: 'name',
    value: 'hello',
  },
  {
    type: 'number',
    operator: '$neq',
    path: 'name',
    value: 1,
  },
  {
    type: 'number',
    operator: '$neq',
    path: 'name.nested',
    value: 1,
  },
  [
    {
      conjunction: '$and',
      children: [
        {
          type: 'string',
          operator: '$eq',
          path: 'name',
          value: 'hello',
        },
      ],
    },
  ],
  [
    {
      conjunction: '$or',
      children: [
        {
          type: 'string',
          operator: '$eq',
          path: 'name',
          value: 'hello',
        },
      ],
    },
  ],
])('should create root filter', (filter) => {
  const parsed = rootFilter.parse(filter)
  expect(parsed).toEqual(filter)
})

test.each<IRootFilter>([
  {
    type: 'string',
    value: 'value',
    operator: '$eq',
    path: 'name',
  },
  [
    {
      type: 'string',
      value: '1',
      operator: '$eq',
      path: 'field1',
    },
    {
      type: 'string',
      value: '2',
      operator: '$neq',
      path: 'field2',
    },
  ],
  [
    {
      conjunction: '$or',
      children: [
        {
          type: 'string',
          value: '2',
          operator: '$neq',
          path: 'field2',
        },
      ],
    },
  ],
  [
    {
      conjunction: '$or',
      children: [
        {
          type: 'string',
          value: '1',
          operator: '$eq',
          path: 'field1',
        },
        {
          type: 'string',
          value: '2',
          operator: '$neq',
          path: 'field2',
        },
      ],
    },
  ],
  [
    {
      conjunction: '$not',
      children: [
        {
          type: 'string',
          value: '1',
          operator: '$eq',
          path: 'field1',
        },
      ],
    },
  ],
])('should convert root filter to record specification', (filter) => {
  const spec = convertFilterSpec(filter)
  expect(spec).toMatchSnapshot()
})
