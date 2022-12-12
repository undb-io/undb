import { IRootFilter, rootFilter } from './filter'

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
    path: ['name', ['first']],
    value: 1,
  },
  [
    {
      conjection: '$and',
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
      conjection: '$or',
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
