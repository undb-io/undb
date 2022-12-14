import { convertFilterSpec, IRootFilter, rootFilter } from './filter'

test.each<IRootFilter>([
  {
    type: 'string',
    operator: '$eq',
    path: 'name',
    value: 'hello',
  },
  {
    type: 'string',
    operator: '$contains',
    path: 'name',
    value: 'hello',
  },
  {
    type: 'string',
    operator: '$starts_with',
    path: 'name',
    value: 'starts with',
  },
  {
    type: 'string',
    operator: '$ends_with',
    path: 'name',
    value: 'ends with',
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

  const spec = convertFilterSpec(filter)
  expect(spec).toMatchSnapshot()
})
