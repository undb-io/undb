import type { ITableManager, Table } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'

export class TableSqliteManager implements ITableManager {
  constructor(protected readonly em: EntityManager) {}

  async create(table: Table): Promise<void> {
    const knex = this.em.getKnex()

    await knex.schema.createTable(table.id.value, (t) => {
      t.string('id').primary()

      for (const field of table.schema.fields) {
        switch (field.type) {
          case 'string':
            t.string(field.name.value)
            break
          case 'number':
            t.float(field.name.value)
            break
          case 'bool':
            t.boolean(field.name.value)
            break
          case 'date':
            t.datetime(field.name.value)
            break
          case 'date-range':
            t.datetime(field.name.value + '_from')
            t.datetime(field.name.value + '_to')
            break
          case 'select':
            t.string(field.name.value)
            break

          default:
            break
        }
      }

      t.timestamp('created_at').defaultTo(knex.fn.now())
      // TODO: updated_at column
      // t.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
}
