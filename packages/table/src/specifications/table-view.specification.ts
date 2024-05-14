import { Ok, WontImplementException, type Result } from "@undb/domain"
import type { IFilterGroup, ViewId } from "../modules"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class WithViewFilter extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly filter: IFilterGroup,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(TableComositeSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId)
    view.setFilter(this.filter)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewFilter(this)
    return Ok(undefined)
  }
}
