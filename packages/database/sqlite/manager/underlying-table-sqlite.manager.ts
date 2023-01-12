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
      builder.createId().createCreatedAt().createUpdatedAt().createUnderlying(table.schema.fields)
    })
  }

  async update(table: Table, spec: ITableSpec): Promise<void> {
    const visitor = new UnderlyingTableSqliteManagerVisitor(table, this.em.getKnex())
    spec.accept(visitor)

    await visitor.commit()
  }
}
