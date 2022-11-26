import { ValueConstraints } from './constraints.vo'

it('should create new constraints object with default required field false', () => {
  const constraint = new ValueConstraints({})

  expect(constraint).toHaveProperty('required', false)
})
