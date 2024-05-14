import { Option } from "@undb/domain"
import type { TableComositeSpecification } from "@undb/table"
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core"
import { TableFilterVisitor } from "./table.filter-visitor"

export class TableDbQuerySpecHandler<Q extends SQLiteSelectQueryBuilder> {
  constructor(private qb: Q) {}

  handle(spec: Option<TableComositeSpecification>): Q {
    if (spec.isSome()) {
      const visitor = new TableFilterVisitor()
      spec.unwrap().accept(visitor)

      this.qb = this.qb.where(visitor.cond)
    }

    return this.qb
  }
}
