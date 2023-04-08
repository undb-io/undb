import { EntityManager } from '@mikro-orm/better-sqlite'
import {
  createTestTable,
  FieldId,
  FieldName,
  FieldValueConstraints,
  StringField,
  TableSchema,
  WithTableSchema,
} from '@undb/core'
import { UnderlyingTableBuilder } from './underlying-table.builder.js'

describe('UnderlyingTableBuilder', () => {
  let em: EntityManager

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
  })

  test('should build table', () => {
    const queries = new UnderlyingTableBuilder(em)
      .createTable(
        createTestTable(
          new WithTableSchema(
            new TableSchema([
              new StringField({
                id: FieldId.fromString('fldid'),
                name: FieldName.create('name'),
                valueConstrains: FieldValueConstraints.create({}),
              }),
            ]),
          ),
        ),
      )
      .build()

    expect(queries).toMatchSnapshot()
  })
})
