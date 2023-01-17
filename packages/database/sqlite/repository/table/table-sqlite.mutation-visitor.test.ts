import {
  createTestTable,
  IUnderlyingTableManager,
  ReferenceField,
  Table as CoreTable,
  View as CoreView,
  Views,
  WithNewField,
  WithTableName,
  WithTableSchema,
  WithTableViews,
} from '@egodb/core'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { mock } from 'vitest-mock-extended'
import { Field, Table } from '../../entity'
import { View } from '../../entity/view'
import { UnderlyingM2MTable } from '../../underlying-table/underlying-table'
import { TableSqliteMutationVisitor } from './table-sqlite.mutation-visitor'
import { TableSqliteRepository } from './table-sqlite.repository'

describe('TableSqliteMutationVisitor', () => {
  let table: CoreTable
  let em: EntityManager
  let mv: TableSqliteMutationVisitor
  let repo: TableSqliteRepository

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
  })

  beforeEach(async () => {
    table = createTestTable()
    em = em.fork()
    mv = new TableSqliteMutationVisitor(table.id.value, em)

    const tm = mock<IUnderlyingTableManager>()
    repo = new TableSqliteRepository(em, tm)

    await repo.insert(table)
  })

  afterEach(async () => {
    await em.nativeDelete(Table, {})
  })

  test('nameEqual', async () => {
    mv.nameEqual(WithTableName.fromString('newname'))
    await em.flush()

    const found = await em.findOne(Table, { id: table.id.value })

    expect(found).not.to.be.null
    expect(found!.name).to.be.eq('newname')
  })

  test('schemaEqual', async () => {
    mv.schemaEqual(WithTableSchema.from([{ id: 'fld1', name: 'field1', key: 'field1', type: 'string' }]))

    await em.flush()

    const field = await em.findOne(Field, { id: 'fld1' })
    expect(field).not.to.be.null
    expect(field!.id).to.be.eq('fld1')
    expect(field!.name).to.be.eq('field1')
    expect(field!.type).to.be.eq('string')
  })

  test('viewsEqual', async () => {
    mv.viewsEqual(
      new WithTableViews(
        new Views([CoreView.create({ id: 'viw1', name: 'view1', key: 'view1', displayType: 'grid' })]),
      ),
    )

    await em.flush()

    const view = await em.findOne(View, { id: 'viw1' })
    expect(view).not.to.be.null
    expect(view!.id).to.be.eq('viw1')
    expect(view!.name).to.be.eq('view1')
    expect(view!.key).to.be.eq('view1')
    expect(view!.displayType).to.be.eq('grid')
    expect(view!.kanban).to.be.undefined
    expect(view!.calendar).to.be.undefined
    expect(view!.filter).to.be.null
    expect(view!.fieldOptions).to.be.null
    expect(view!.fieldsOrder).to.be.undefined
    expect(view!.createdAt).to.be.instanceOf(Date)
    expect(view!.updatedAt).to.be.instanceOf(Date)
    expect(view!.deletedAt).to.be.undefined
  })

  describe('newField', () => {
    test('new reference feild', async () => {
      const field = ReferenceField.create({ id: 'fldid', type: 'reference', name: 'reference', key: 'reference' })
      mv.newField(new WithNewField(field))

      await mv.commit()
      await em.flush()

      const m2m = new UnderlyingM2MTable(table.id.value, field)

      const hasTable = await em.getKnex().schema.hasTable(m2m.name)
      expect(hasTable).to.be.true

      const columnInfo = await em.getKnex().table(m2m.name).columnInfo()
      expect(columnInfo).toMatchInlineSnapshot(`
        {
          "id": {
            "defaultValue": null,
            "maxLength": "255",
            "nullable": false,
            "type": "varchar",
          },
          "ref_id": {
            "defaultValue": null,
            "maxLength": "255",
            "nullable": false,
            "type": "varchar",
          },
        }
      `)
    })
  })
})
