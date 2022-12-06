import { $filter, Filter } from './operators'

test.each<Filter>([
  { hello: 'world' },
  { hello: { $eq: 'world' } },
  {
    $and: [
      { $or: [{ hello: { $eq: 'world' } }, { hello: { $eq: 'this' } }] },
      { $or: [{ this: { $eq: 'is' } }, { this: { $eq: 'is' } }] },
    ],
  },
])('should create operator', (filter) => {
  const result = $filter.safeParse(filter)
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data).toEqual(filter)
  }
})
