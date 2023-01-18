import type { Table } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingColumnBuilder } from './underlying-column.builder'

export class UnderlyingTableBuilder {
  constructor(private readonly knex: Knex) {}

  private queries: string[] = []

  private addQueries(...queries: string[]) {
    for (const query of queries) {
      this.queries.unshift(query)
    }
  }

  public build() {
    return this.queries
  }

  public createTable(table: Table) {
    const query = this.knex.schema
      .createTable(table.id.value, (tb) => {
        const queries = new UnderlyingColumnBuilder(this.knex, tb)
          .createAutoIncrement()
          .createId(table.id.value)
          .createCreatedAt()
          .createUpdatedAt(table.id.value)
          .createDeletedAt()
          .createUnderlying(table.schema.fields)
          .build()

        this.addQueries(...queries)
      })
      .toQuery()

    this.addQueries(query)

    return this
  }
}
