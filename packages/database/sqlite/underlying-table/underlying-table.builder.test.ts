import {
  createTestTable,
  FieldId,
  FieldName,
  FieldValueConstraints,
  StringField,
  TableSchema,
  WithTableSchema,
} from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from './underlying-table.builder'

describe('UnderlyingTableBuilder', () => {
  let knex: Knex

  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
  })

  test('should build table', () => {
    const queries = new UnderlyingTableBuilder(knex)
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
