import type { Table } from '@egodb/core'
import { BaseEntityManager } from '../repository/base-entity-manager'
import { UnderlyingColumnBuilder } from './underlying-column.builder'

export class UnderlyingTableBuilder extends BaseEntityManager {
  public build() {
    return this.queries
  }

  public createTable(table: Table) {
    const knex = this.em.getKnex()
    const query = knex.schema
      .createTable(table.id.value, (tb) => {
        const queries = new UnderlyingColumnBuilder(knex, tb)
          .createAutoIncrement()
          .createId(table.id.value)
          .createCreatedAt()
          .createUpdatedAt(table.id.value)
          .createDeletedAt()
          .createUnderlying(table.schema.nonSystemFields)
          .build()

        this.unshiftQueries(...queries)
      })
      .toQuery()

    this.unshiftQueries(query)

    return this
  }
}
