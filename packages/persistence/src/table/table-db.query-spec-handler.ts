import { Option } from "@undb/domain"
import type { TableComositeSpecification } from "@undb/table"
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core"
import type { Database } from "../db"
import { TableFilterVisitor } from "./table.filter-visitor"

export class TableDbQuerySpecHandler<Q extends SQLiteSelectQueryBuilder> {
  constructor(
    private readonly db: Database,
    private sb: Q,
  ) {}

  handle(spec: Option<TableComositeSpecification>): Q {
    const visitor = new TableFilterVisitor(this.db, this.sb)
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)

      visitor.sb = visitor.sb!.where(visitor.cond)
    }

    return visitor.sb! as Q
  }
}
