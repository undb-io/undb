import type { ITableSpec, IUnderlyingTableManager, Table } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from '../entity/underlying-table/underlying-table.builder'
import { UnderlyingTableSqliteManagerVisitor } from './underlying-table-sqlite.manager-visitor'

export class UnderlyingTableSqliteManager implements IUnderlyingTableManager {
  constructor(protected readonly em: EntityManager) {}
  async create(table: Table): Promise<void> {
    const knex = this.em.getKnex()

    const queries = new UnderlyingTableBuilder(knex).createTable(table).build()

    for (const query of queries) {
      await this.em.execute(query)
    }
  }

  async update(tableId: string, spec: ITableSpec): Promise<void> {
    const visitor = new UnderlyingTableSqliteManagerVisitor(tableId, this.em)
    spec.accept(visitor)

    await visitor.commit()
  }

  async delete(tableId: string): Promise<void> {
    // TODO: drop table later
    // const knex = this.em.getKnex()
    // const sb = knex.schema.dropTable(tableId)
    // await this.em.execute(sb.toQuery())
  }
}
