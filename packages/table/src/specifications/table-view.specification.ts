import { Ok, Option, WontImplementException, type Result } from "@undb/domain"
import type { FieldId, IRootViewFilter, View, ViewId } from "../modules"
import type { IViewAggregate } from "../modules/views/view/view-aggregate/view-aggregate.vo"
import type { IRootViewColor } from "../modules/views/view/view-color"
import type { IViewFields } from "../modules/views/view/view-fields"
import type { IViewOption } from "../modules/views/view/view-option.vo"
import type { IViewSort } from "../modules/views/view/view-sort"
import type { IWidgetDTO } from "../modules/widgets/widget.vo"
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

export class WithViewWidgets extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly previous: Option<IWidgetDTO[]>,
    public readonly widgets: IWidgetDTO[],
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewWidgets.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId.value)
    view.setWidgets(this.widgets)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewWidgets(this)
    return Ok(undefined)
  }
}

export class WithView extends TableComositeSpecification {
  constructor(
    public readonly previous: View,
    public readonly view: View,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(TableComositeSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.views = t.views.update(this.view)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withView(this)
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
    t.views = t.views.addView(t, this.view)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withNewView(this)
    return Ok(undefined)
  }
}

export class WithoutView extends TableComositeSpecification {
  constructor(public readonly view: View) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(TableComositeSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.views = t.views.deleteView(this.view)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutView(this)
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
    view.setFields(t, this.fields)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewFields(this)
    return Ok(undefined)
  }
}

export class WithViewIdSpecification extends TableComositeSpecification {
  constructor(public readonly viewId: string) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewIdSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    throw new WontImplementException(WithViewIdSpecification.name + ".mutate")
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewId(this)
    return Ok(undefined)
  }
}

export class WithViewFieldWidth extends TableComositeSpecification {
  constructor(
    public readonly viewId: ViewId,
    public readonly fieldId: FieldId,
    public readonly width: number,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithViewFieldWidth.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const view = t.views.getViewById(this.viewId.value)
    if (view.type === "grid") {
      view.setFieldWidth(this.fieldId.value, this.width)
    }
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViewFieldWidth(this)
    return Ok(undefined)
  }
}
