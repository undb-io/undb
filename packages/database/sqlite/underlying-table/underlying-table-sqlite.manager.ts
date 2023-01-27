import type { ITableSpec, IUnderlyingTableManager, Table } from '@egodb/core'
import { BaseEntityManager } from '../repository/base-entity-manager'
import { UnderlyingTableSqliteManagerVisitor } from './underlying-table-sqlite.manager-visitor'
import { UnderlyingTableBuilder } from './underlying-table.builder'

export class UnderlyingTableSqliteManager extends BaseEntityManager implements IUnderlyingTableManager {
  async create(table: Table): Promise<void> {
    const queries = new UnderlyingTableBuilder(this.em).createTable(table).build()

    this.addQueries(...queries)

    await this.commit()
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
