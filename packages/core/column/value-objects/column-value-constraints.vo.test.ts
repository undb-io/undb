import { ColumnValueConstraints } from './column-value-constraints.vo'

it('should create new constraints object with default required field false', () => {
  const constraint = ColumnValueConstraints.create({})

  expect(constraint).toHaveProperty('required', false)
})
