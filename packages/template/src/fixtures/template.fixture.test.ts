import { createTestTemplate } from './template.fixture'

describe('test createTestTemplate', () => {
  test('create default test template success', () => {
    const template = createTestTemplate()

    expect(template).toHaveProperty(['export'])
  })
})
