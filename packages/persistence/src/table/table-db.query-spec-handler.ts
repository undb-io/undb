import { Option } from "@undb/domain"
import type { TableComositeSpecification } from "@undb/table"
import type { ExpressionBuilder } from "kysely"
import type { IQueryBuilder } from "../qb"
import { TableFilterVisitor } from "./table.filter-visitor"

export class TableDbQuerySpecHandler {
  constructor(
    private readonly qb: IQueryBuilder,
    private readonly eb: ExpressionBuilder<any, any>,
  ) {}

  handle(spec: Option<TableComositeSpecification>) {
    const visitor = new TableFilterVisitor(this.qb, this.eb)
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }

    return visitor.cond
  }
}
