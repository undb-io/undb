import { Option } from "@undb/domain"
import type { TableComositeSpecification } from "@undb/table"
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core"
import { TableFilterVisitor } from "./table.filter-visitor"

export class TableDbQuerySpecHandler<Q extends SQLiteSelectQueryBuilder> {
  constructor(private qb: Q) {}

  handle(spec: Option<TableComositeSpecification>): Q {
    const visitor = new TableFilterVisitor(this.qb)
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)

      visitor.qb = visitor.qb!.where(visitor.cond)
    }

    return visitor.qb! as Q
  }
}
