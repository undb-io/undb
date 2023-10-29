import { EntityManager } from '@mikro-orm/better-sqlite'
import {
  ClsStore,
  Table as CoreTable,
  ViewVO as CoreView,
  ITableCache,
  ReferenceField,
  Views,
  WithNewField,
  WithTableName,
  WithTableSchema,
  WithTableViews,
  createTestTable,
} from '@undb/core'
import { identity } from 'lodash-es'
import { mock, mockDeep } from 'vitest-mock-extended'
import { Field, Table } from '../../entity/index.js'
import { View } from '../../entity/view.js'
import { SqliteUnitOfWork } from '../../sqlite.uow.js'
import { AdjacencyListTable } from '../../underlying-table/underlying-foreign-table.js'
import { TableSqliteMutationVisitor } from './table-sqlite.mutation-visitor.js'
import { TableSqliteRepository } from './table-sqlite.repository.js'

describe('TableSqliteMutationVisitor', () => {
  let table: CoreTable
  let em: EntityManager
  let mv: TableSqliteMutationVisitor
  let repo: TableSqliteRepository
  let ctx: ClsStore

  beforeAll(() => {
    // @ts-expect-error
    em = global.em
    ctx = mockDeep<ClsStore>({ t: identity })
  })

  beforeEach(async () => {
    table = createTestTable()
    em = em.fork()
    const uow = new SqliteUnitOfWork(em)
    mv = new TableSqliteMutationVisitor(table.id.value, em)

    const cache = mock<ITableCache>()
    repo = new TableSqliteRepository(uow, cache)

    await em.nativeDelete(Table, {})
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
    mv.schemaEqual(WithTableSchema.from([{ id: 'fld1', name: 'field1', type: 'string' }], ctx))

    await em.flush()

    const field = await em.findOne(Field, { id: 'fld1' })
    expect(field).not.to.be.null
    expect(field!.id).to.be.eq('fld1')
    expect(field!.name).to.be.eq('field1')
    expect(field!.type).to.be.eq('string')
  })

  test('viewsEqual', async () => {
    mv.viewsEqual(new WithTableViews(new Views([CoreView.create({ id: 'viw1', name: 'view1', displayType: 'grid' })])))

    await em.flush()

    const view = await em.findOne(View, { id: 'viw1' })
    expect(view).not.to.be.null
    expect(view!.id).to.be.eq('viw1')
    expect(view!.name).to.be.eq('view1')
    expect(view!.displayType).to.be.eq('grid')
    expect(view!.kanban).to.be.undefined
    expect(view!.calendar).to.be.undefined
    expect(view!.filter).to.be.undefined
    expect(view!.fieldOptions).to.be.undefined
    expect(view!.fieldsOrder).to.be.undefined
    expect(view!.createdAt).to.be.instanceOf(Date)
    expect(view!.updatedAt).to.be.instanceOf(Date)
    expect(view!.deletedAt).to.be.undefined
  })

  describe('newField', () => {
    test('new reference feild', async () => {
      const field = ReferenceField.create({ id: 'fldid', name: 'reference' })
      mv.newField(new WithNewField(field))

      await mv.commit()
      await em.flush()

      const m2m = AdjacencyListTable.fromField(table.id.value, field)

      const hasTable = await em.getKnex().schema.hasTable(m2m.name)
      expect(hasTable).to.be.true

      const columnInfo = await em.getKnex().table(m2m.name).columnInfo()
      expect(columnInfo).toMatchInlineSnapshot(`
        {
          "from_id": {
            "defaultValue": null,
            "maxLength": "255",
            "nullable": false,
            "type": "varchar",
          },
          "to_id": {
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
