import { Option } from '@undb/domain'
import type { TableComositeSpecification } from '@undb/table'
import type { SQLiteSelectQueryBuilder } from 'drizzle-orm/sqlite-core'
import { TableQueryVisitor } from './table.query-visitor'

export class TableDbQuerySpecHandler<Q extends SQLiteSelectQueryBuilder> {
  constructor(private qb: Q) {}

  handle(spec: Option<TableComositeSpecification>): Q {
    if (spec.isSome()) {
      const visitor = new TableQueryVisitor()
      spec.unwrap().accept(visitor)

      this.qb = this.qb.where(visitor.cond)
    }

    return this.qb
  }
}
