import { Ok, Option, WontImplementException, type Result } from "@undb/domain"
import type { IRootViewFilter, View, ViewId } from "../modules"
import type { IViewAggregate } from "../modules/views/view/view-aggregate/view-aggregate.vo"
import type { IRootViewColor } from "../modules/views/view/view-color"
import type { IViewFields } from "../modules/views/view/view-fields"
import type { IViewOption } from "../modules/views/view/view-option.vo"
import type { IViewSort } from "../modules/views/view/view-sort"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class WithViewOption extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly previous: Option<IViewOption>,
    public readonly option: IViewOption,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewFilter.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId.value)
    view.setOption(this.option)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewOption(this)
    return Ok(undefined)
  }
}

export class WithNewView extends TableComositeSpecification {
  constructor(public readonly view: View) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(TableComositeSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.views = t.views.addView(this.view)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withNewView(this)
    return Ok(undefined)
  }
}

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
    const view = t.views.getViewById(this.viewId.value)
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
    const view = t.views.getViewById(this.viewId.value)
    view.setColor(this.color)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewColor(this)
    return Ok(undefined)
  }
}

export class WithViewSort extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly previous: Option<IViewSort>,
    public readonly sort: IViewSort,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewColor.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId.value)
    view.setSort(this.sort)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewSort(this)
    return Ok(undefined)
  }
}

export class WithViewAggregate extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly previous: Option<IViewAggregate>,
    public readonly aggregate: IViewAggregate,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewColor.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId.value)
    view.setAggregate(this.aggregate)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewAggregate(this)
    return Ok(undefined)
  }
}

export class WithViewFields extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly previous: Option<IViewFields>,
    public readonly fields: IViewFields,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewColor.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId.value)
    view.setFields(this.fields)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewFields(this)
    return Ok(undefined)
  }
}
