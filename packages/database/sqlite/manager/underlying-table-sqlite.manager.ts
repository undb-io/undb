import type { ITableSpec, IUnderlyingTableManager, Table } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from '../entity/underlying-table/underlying-table.builder'
import { UnderlyingTableSqliteManagerVisitor } from './underlying-table-sqlite.manager-visitor'

export class UnderlyingTableSqliteManager implements IUnderlyingTableManager {
  constructor(protected readonly em: EntityManager) {}

  async create(table: Table): Promise<void> {
    const knex = this.em.getKnex()

    await knex.schema.createTable(table.id.value, (t) => {
      const builder = new UnderlyingTableBuilder(knex, t, table.id.value)
      builder.createId().createCreatedAt().createUpdatedAt()

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
    })
  }

  async update(table: Table, spec: ITableSpec): Promise<void> {
    const visitor = new UnderlyingTableSqliteManagerVisitor(table, this.em.getKnex().schema)
    spec.accept(visitor)

    await visitor.commit()
  }
}
