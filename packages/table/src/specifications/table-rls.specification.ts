import { NotImplementException, Ok, Option, WontImplementException, type Result } from "@undb/domain"
import type { IRootTableRLS, ViewId } from "../modules"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class WithTableRLS extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly previous: Option<IRootTableRLS>,
    public readonly rls: IRootTableRLS,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithTableRLS.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    throw new NotImplementException(WithTableRLS.name + ".mutate")
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withTableRLS(this)
    return Ok(undefined)
  }
}
