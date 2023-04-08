import { EntityManager } from '@mikro-orm/better-sqlite'
import {
  FieldId,
  FieldName,
  FieldValueConstraints,
  StringField,
  TableSchema,
  WithNewField,
  WithTableSchema,
} from '@undb/core'
import { UnderlyingTableSqliteManagerVisitor } from './underlying-table-sqlite.manager-visitor.js'

describe('UnderlyingTableSqliteManagerVisitor', () => {
  let em: EntityManager
  const tableName = 'tbltest'

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
  })

  beforeEach(async () => {
    await em.getKnex().schema.createTable(tableName, (t) => {
      t.increments().primary()
    })

    const hasTable = await em.getKnex().schema.hasTable(tableName)
    expect(hasTable).to.be.true
  })

  afterEach(async () => {
    await em.getKnex().schema.dropTable(tableName)
  })

  test('schemaEqual', async () => {
    const visitor = new UnderlyingTableSqliteManagerVisitor(tableName, em)
    visitor.schemaEqual(
      new WithTableSchema(
        new TableSchema([
          new StringField({
            id: FieldId.fromString('fldid'),
            name: FieldName.create('field1'),
            valueConstrains: FieldValueConstraints.create({}),
          }),
        ]),
      ),
    )

    expect(visitor.queries).toMatchInlineSnapshot(`
      [
        "alter table \`tbltest\` add column \`fldid\` varchar(255)",
      ]
    `)

    const data = await visitor.commit()
    expect(data).to.be.undefined
  })

  test('newField', async () => {
    const visitor = new UnderlyingTableSqliteManagerVisitor(tableName, em)
    visitor.newField(
      new WithNewField(
        new StringField({
          id: FieldId.fromString('fldid'),
          name: FieldName.create('field1'),
          valueConstrains: FieldValueConstraints.create({}),
        }),
      ),
    )

    expect(visitor.queries).toMatchInlineSnapshot(`
      [
        "alter table \`tbltest\` add column \`fldid\` varchar(255)",
      ]
    `)

    const data = await visitor.commit()
    expect(data).to.be.undefined
  })
})
