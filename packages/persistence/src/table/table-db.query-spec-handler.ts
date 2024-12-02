import { Option } from "@undb/domain"
import type { TableComositeSpecification } from "@undb/table"
import type { ExpressionBuilder } from "kysely"
import type { IQueryBuilder } from "../qb.type"
import { TableFilterVisitor } from "./table.filter-visitor"

export class TableDbQuerySpecHandler {
  constructor(
    private readonly qb: IQueryBuilder,
    private readonly eb: ExpressionBuilder<any, any>,
    private readonly spaceId: string,
    private readonly ignoreSpace = false,
  ) {}

  handle(spec: Option<TableComositeSpecification>) {
    const visitor = new TableFilterVisitor(this.qb, this.eb, this.spaceId, this.ignoreSpace)
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }

    return visitor.cond
  }
}
