import { Ok, Option, WontImplementException, type Result } from "@undb/domain"
import type { IRootViewFilter, ViewId } from "../modules"
import type { IRootViewColor } from "../modules/views/view/view-color"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class WithViewFilter extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly prefiousFilter: Option<IRootViewFilter>,
    public readonly filter: IRootViewFilter,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewFilter.name + ".isSatisfiedBy")
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

export class WithViewColor extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly prefiousColor: Option<IRootViewColor>,
    public readonly color: IRootViewColor,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewColor.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId)
    view.setColor(this.color)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewColor(this)
    return Ok(undefined)
  }
}
