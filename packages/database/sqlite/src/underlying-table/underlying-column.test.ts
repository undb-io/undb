import { Knex } from '@mikro-orm/better-sqlite'
import {
  UnderlyingCreatedAtColumn,
  UnderlyingDeletedAtColumn,
  UnderlyingIdColumn,
  UnderlyingStringColumn,
  UnderlyingUpdatedAtColumn,
} from './underlying-column.js'

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
    const id = new UnderlyingIdColumn(undefined, 'tabletest')

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
    const id = new UnderlyingCreatedAtColumn(undefined, 'tabletest')

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
    const id = new UnderlyingUpdatedAtColumn(undefined, 'tabletest')

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
    const id = new UnderlyingDeletedAtColumn(undefined, 'tabletest')

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
      const field = new UnderlyingStringColumn('fld1', 'tabletest')

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
  })
})
