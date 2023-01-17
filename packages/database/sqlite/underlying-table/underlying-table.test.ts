import { ReferenceField } from '@egodb/core'
import { UnderlyingM2MTable } from './underlying-table'

describe('UnderlyingM2MTable', () => {
  test('should create UnderlyingM2MTable', () => {
    const table = new UnderlyingM2MTable(
      'tablename',
      ReferenceField.create({ id: 'fldid', name: 'reference', type: 'reference', key: 'reference' }),
    )

    expect(table.name).toMatchInlineSnapshot('"fldid_tablename"')
  })
})
