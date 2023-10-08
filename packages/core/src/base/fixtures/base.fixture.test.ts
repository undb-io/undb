import { createTestBase } from './base.fixture'

describe('base fixture test', () => {
  test('create test base success', () => {
    const base = createTestBase()

    expect(base).toMatchSnapshot()
  })
})
