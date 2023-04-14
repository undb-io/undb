import type { Table } from '@undb/core'
import { BaseEntityManager } from '../repository/base-entity-manager.js'
import { UnderlyingColumnBuilder } from './underlying-column.builder.js'

export class UnderlyingTableBuilder extends BaseEntityManager {
  public build() {
    return this.queries
  }

  public createTable(table: Table) {
    const knex = this.em.getKnex()
    const query = knex.schema
      .createTableIfNotExists(table.id.value, (tb) => {
        const queries = new UnderlyingColumnBuilder(this.em, knex, tb, table.id.value, true)
          .createAutoIncrement()
          .createId()
          .createCreatedAt()
          .createCreatedBy()
          .createUpdatedAt()
          .createUpdatedBy()
          .createDeletedAt()
          .createDeletedBy()
          .createUnderlying(table.schema.nonSystemFields)
          .build()

        this.unshiftQueries(...queries)
      })
      .toQuery()

    this.unshiftQueries(query)

    return this
  }
}
