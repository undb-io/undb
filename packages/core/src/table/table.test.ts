import { createTestTable } from './fixtures/table.fixture'
import { WithTableName } from './specifications/index.js'

describe('Table', () => {
  describe('updateName', () => {
    test('should update table name', () => {
      const table = createTestTable(WithTableName.fromString('old'))
      table.updateName('new')

      expect(table.name.value).toBe('new')
    })
  })

  describe('createField', () => {
    test('should add new field', () => {
      const table = createTestTable()
      table.createField(undefined, { type: 'string', name: 'string' })
    })
  })
})
