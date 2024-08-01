import { Ok, Option, WontImplementException, type Result } from "@undb/domain"
import type { TableRLSGroup } from "../modules"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class WithTableRLS extends TableComositeSpecification {
  constructor(
    public readonly previous: Option<TableRLSGroup>,
    public readonly rls: Option<TableRLSGroup>,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithTableRLS.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.rls = this.rls
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withTableRLS(this)
    return Ok(undefined)
  }
}
