import { ReferenceField, StringField, TreeField } from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import {
  UnderlyingCreatedAtColumn,
  UnderlyingDeletedAtColumn,
  UnderlyingIdColumn,
  UnderlyingReferenceColumn,
  UnderlyingStringColumn,
  UnderlyingTreeColumn,
  UnderlyingUpdatedAtColumn,
} from './underlying-column'

describe('UnderlyingColumn', () => {
  let knex: Knex

  const tableName = 'tabletest'

  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
  })

  afterEach(async () => {
    await knex.schema.dropTableIfExists(tableName)
  })

  test('UnderlyingIdColumn', async () => {
    const id = new UnderlyingIdColumn()

    await knex.schema.createTable(tableName, (tb) => {
      id.build(tb)
    })

    const info = await knex(tableName).columnInfo()
    expect(info).to.have.property('id')
    expect(info).toMatchInlineSnapshot(`
      {
        "id": {
          "defaultValue": null,
          "maxLength": "255",
          "nullable": false,
          "type": "varchar",
        },
      }
    `)
  })

  test('UnderlyingCreatedAtColumn', async () => {
    const id = new UnderlyingCreatedAtColumn()

    await knex.schema.createTable(tableName, (tb) => {
      id.build(tb, knex)
    })

    const info = await knex(tableName).columnInfo()
    expect(info).to.have.property('created_at')
    expect(info).toMatchInlineSnapshot(`
      {
        "created_at": {
          "defaultValue": "CURRENT_TIMESTAMP",
          "maxLength": null,
          "nullable": false,
          "type": "datetime",
        },
      }
    `)
  })

  test('UnderlyingUpdatedAtColumn', async () => {
    const id = new UnderlyingUpdatedAtColumn()

    await knex.schema.createTable(tableName, (tb) => {
      id.build(tb, knex)
    })

    const info = await knex(tableName).columnInfo()
    expect(info).to.have.property('updated_at')
    expect(info).toMatchInlineSnapshot(`
      {
        "updated_at": {
          "defaultValue": "CURRENT_TIMESTAMP",
          "maxLength": null,
          "nullable": false,
          "type": "datetime",
        },
      }
    `)
  })

  test('UnderlyingDeletedAtColumn', async () => {
    const id = new UnderlyingDeletedAtColumn()

    await knex.schema.createTable(tableName, (tb) => {
      id.build(tb)
    })

    const info = await knex(tableName).columnInfo()
    expect(info).to.have.property('deleted_at')
    expect(info).toMatchInlineSnapshot(`
      {
        "deleted_at": {
          "defaultValue": null,
          "maxLength": null,
          "nullable": true,
          "type": "datetime",
        },
      }
    `)
  })

  describe('UnderlyingFieldColumn', () => {
    test('UnderlyingStringColumn', async () => {
      const field = new UnderlyingStringColumn(StringField.create({ id: 'fld1', name: 'name' }))

      await knex.schema.createTable(tableName, (tb) => {
        field.build(tb)
      })

      const info = await knex(tableName).columnInfo()
      expect(info).toMatchInlineSnapshot(`
        {
          "fld1": {
            "defaultValue": null,
            "maxLength": "255",
            "nullable": true,
            "type": "varchar",
          },
        }
      `)
    })

    test('UnderlyingReferenceColumn', async () => {
      const field = new UnderlyingReferenceColumn(ReferenceField.create({ id: 'fld1', name: 'name' }))

      await knex.schema.createTable(tableName, (tb) => {
        field.build(tb)
      })

      const info = await knex(tableName).columnInfo()
      expect(info).toMatchInlineSnapshot(`
        {
          "fld1": {
            "defaultValue": null,
            "maxLength": null,
            "nullable": true,
            "type": "json",
          },
        }
      `)
    })

    test('UnderlyingTreeColumn', async () => {
      const field = new UnderlyingTreeColumn(TreeField.create({ id: 'fld1', name: 'name' }))

      await knex.schema.createTable(tableName, (tb) => {
        field.build(tb)
      })

      const info = await knex(tableName).columnInfo()
      expect(info).toMatchInlineSnapshot(`
        {
          "fld1": {
            "defaultValue": null,
            "maxLength": null,
            "nullable": true,
            "type": "json",
          },
        }
      `)
    })
  })
})
