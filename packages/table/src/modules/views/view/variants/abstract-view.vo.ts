import { None, Option, Some, and, applyRules } from "@undb/domain"
import { getNextName } from "@undb/utils"
import { z } from "@undb/zod"
import type { IDuplicateViewDTO, IUpdateViewDTO } from "../../../../dto"
import { ViewWidgetNameShouldBeUnique } from "../../../../rules/view-widget-name-should-be-unique.rule"
import { type TableComositeSpecification } from "../../../../specifications"
import {
  WithNewView,
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFields,
  WithViewFilter,
  WithViewOption,
  WithViewSort,
  WithViewWidgets,
  WithoutView,
} from "../../../../specifications/table-view.specification"
import { tableId } from "../../../../table-id.vo"
import type { TableDo } from "../../../../table.do"
import type { Field } from "../../../schema"
import { WidgetVO, widgetDTO, type IWidgetDTO } from "../../../widgets/widget.vo"
import type { IViewDTO } from "../dto"
import { ViewAggregateVO, viewAggregate, type IViewAggregate } from "../view-aggregate/view-aggregate.vo"
import { ViewColor, viewColorGroup, type IRootViewColor } from "../view-color/view-color.vo"
import { ViewFields, viewFields, type IViewFields } from "../view-fields/view-fields.vo"
import { ViewFilter, viewFilterGroup, type IRootViewFilter } from "../view-filter/view-filter.vo"
import { ViewIdVo, viewId, type ViewId } from "../view-id.vo"
import { ViewNameVo, viewName } from "../view-name.vo"
import { ViewOption, viewOption, type IViewOption } from "../view-option.vo"
import { ViewSort, viewSort, type IViewSort } from "../view-sort/view-sort.vo"
import type { View, ViewType } from "../view.type"

export const createBaseViewDTO = z.object({
  id: viewId.optional(),
  name: viewName,
  isDefault: z.boolean().optional(),

  filter: viewFilterGroup.optional(),
  color: viewColorGroup.optional(),
  sort: viewSort.optional(),
  fields: viewFields.optional(),
  aggregate: viewAggregate.optional(),
  widgets: widgetDTO.array().optional(),
})

export type ICreateBaseViewDTO = z.infer<typeof createBaseViewDTO>

export const updateBaseViewDTO = z.object({
  tableId,
  viewId: viewId.optional(),
  name: viewName,
})

export const baseViewDTO = z.object({
  id: viewId,
  name: viewName,
  option: viewOption.optional(),
  isDefault: z.boolean().optional(),

  filter: viewFilterGroup.optional(),
  color: viewColorGroup.optional(),
  sort: viewSort.optional(),
  aggregate: viewAggregate.optional(),
  fields: viewFields.optional(),
  widgets: widgetDTO.array().optional(),
})

export type IBaseViewDTO = z.infer<typeof baseViewDTO>

export abstract class AbstractView {
  id!: ViewId
  name!: ViewNameVo
  isDefault: boolean
  option: Option<ViewOption> = None

  filter: Option<ViewFilter> = None
  color: Option<ViewColor> = None
  sort: Option<ViewSort> = None
  aggregate: Option<ViewAggregateVO> = None
  fields: Option<ViewFields> = None
  widgets: Option<WidgetVO[]> = None

  abstract type: ViewType

  constructor(table: TableDo, dto: IBaseViewDTO) {
    this.id = new ViewIdVo(dto.id)
    this.name = new ViewNameVo(dto.name)
    this.isDefault = dto.isDefault ?? false
    if (dto.filter) {
      this.setFilter(dto.filter)
    }
    if (dto.color) {
      this.setColor(dto.color)
    }
    if (dto.sort) {
      this.setSort(dto.sort)
    }
    if (dto.aggregate) {
      this.setAggregate(dto.aggregate)
    }
    if (dto.fields) {
      this.setFields(table, dto.fields)
    }
    if (dto.option) {
      this.setOption(dto.option)
    }
    if (dto.widgets) {
      this.setWidgets(dto.widgets)
    }
  }

  setWidgets(widgets: IWidgetDTO[]) {
    const names = widgets.map((w) => w.name)
    applyRules(new ViewWidgetNameShouldBeUnique(names))
    this.widgets = Some(widgets.map((widget) => new WidgetVO(widget)))
  }

  $createWidgetSpec(dto: IWidgetDTO): Option<WithViewWidgets> {
    const widget = new WidgetVO(dto)
    const previous = this.widgets.into(null)
    const widgets = this.widgets.unwrapOr([]).concat(widget)
    return Some(new WithViewWidgets(this.id, Option(previous), widgets))
  }

  $duplicateWidgetSpec(widgetId: string): Option<WithViewWidgets> {
    const widget = this.widgets.unwrapOr([]).find((w) => w.id === widgetId)
    if (!widget) {
      return None
    }
    const previous = this.widgets.into(null)
    const widgetsNames = previous?.map((w) => w.name) ?? []
    const name = getNextName(widgetsNames, widget.name)
    const duplicated = widget.duplicate(name)
    const widgets = this.widgets.unwrapOr([]).concat(duplicated)
    return Some(new WithViewWidgets(this.id, Option(previous), widgets))
  }

  $updateWidgetSpec(dto: IWidgetDTO): Option<WithViewWidgets> {
    const widget = new WidgetVO(dto)
    const previous = this.widgets.into(null)
    const widgets = this.widgets.unwrapOr([]).map((w) => (w.id === widget.id ? widget : w))
    return Some(new WithViewWidgets(this.id, Option(previous), widgets))
  }

  $deleteWidgetSpec(id: string): Option<WithViewWidgets> {
    const previous = this.widgets.into(null)
    const widgets = this.widgets.unwrapOr([]).filter((w) => w.id !== id)
    return Some(new WithViewWidgets(this.id, Option(previous), widgets))
  }

  get showSystemFields() {
    return this.option.mapOr(false, (f) => !!f.props.showSystemFields)
  }

  setOption(option: IViewOption) {
    const vo = new ViewOption(option)

    this.option = Some(vo)
  }

  $setOptionSpec(option: IViewOption): Option<WithViewOption> {
    if (this.option.mapOr(false, (f) => f.equals(new ViewOption(option)))) {
      return None
    }

    const previous = this.option.into(null)?.value
    return Some(new WithViewOption(this.id, Option(previous), option))
  }

  abstract $update(table: TableDo, input: IUpdateViewDTO): Option<WithView>
  abstract $duplicate(table: TableDo, dto: IDuplicateViewDTO): Option<WithNewView>

  $delete(): Option<WithoutView> {
    return Some(new WithoutView(this as unknown as View))
  }

  setFilter(filter: IRootViewFilter) {
    const filterVO = new ViewFilter(filter)
    this.filter = Option(filterVO.isEmpty ? undefined : filterVO)
  }

  $setFilterSpec(filter: IRootViewFilter): Option<WithViewFilter> {
    if (this.filter.mapOr(false, (f) => f.isEqual(filter))) {
      return None
    }

    const previous = this.filter.into(null)?.value

    return Some(new WithViewFilter(this.id, Option(previous), filter))
  }

  setColor(color: IRootViewColor) {
    const colorVO = new ViewColor(color)

    this.color = Option(colorVO.isEmpty ? undefined : colorVO)
  }

  $setColorSpec(color: IRootViewColor): Option<WithViewColor> {
    if (this.color.mapOr(false, (f) => f.isEqual(color))) {
      return None
    }

    const previous = this.color.into(null)?.value
    return Some(new WithViewColor(this.id, Option(previous), color))
  }

  setSort(sort: IViewSort) {
    const sortVO = new ViewSort(sort)

    this.sort = Some(sortVO)
  }

  $setSortSpec(sort: IViewSort): Option<WithViewSort> {
    if (this.sort.mapOr(false, (f) => f.isEqual(sort))) {
      return None
    }

    const previous = this.sort.into(null)?.value
    return Some(new WithViewSort(this.id, Option(previous), sort))
  }

  setAggregate(aggregate: IViewAggregate) {
    this.aggregate = Some(new ViewAggregateVO(aggregate))
  }

  $setAggregateSpec(aggregate: IViewAggregate): Option<WithViewAggregate> {
    if (this.aggregate.mapOr(false, (f) => f.equals(new ViewAggregateVO(aggregate)))) {
      return None
    }

    const previous = this.aggregate.into(null)?.value
    return Some(new WithViewAggregate(this.id, Option(previous), aggregate))
  }

  setFields(table: TableDo, fields: IViewFields) {
    this.fields = Some(new ViewFields(table, fields))
  }

  $setFieldsSpec(fields: IViewFields): Option<WithViewFields> {
    if (this.fields.mapOr(false, (f) => f.isEqual(fields))) {
      return None
    }

    const previous = this.fields.into(null)?.value
    return Some(new WithViewFields(this.id, Option(previous), fields))
  }

  $addField(table: TableDo, field: Field): Option<WithViewFields> {
    if (this.fields.isNone()) {
      return None
    }

    const previous = this.fields.into(null)?.value
    const fields = this.fields.unwrap().addField(table, field)

    return Some(new WithViewFields(this.id, Option(previous), fields.toJSON()))
  }

  $deleteField(table: TableDo, field: Field): Option<TableComositeSpecification> {
    let specs: TableComositeSpecification[] = []
    if (this.fields.isSome()) {
      const previous = this.fields.into(null)?.value
      const fields = this.fields.unwrap().deleteField(table, field)

      specs.push(new WithViewFields(this.id, Option(previous), fields.toJSON()))
    }

    if (this.filter.isSome()) {
      const previous = this.filter.into(null)?.value
      const filter = this.filter.unwrap().deleteField(field)

      specs.push(new WithViewFilter(this.id, Option(previous), filter.toJSON()))
    }

    if (this.color.isSome()) {
      const previous = this.color.into(null)?.value
      const color = this.color.unwrap().deleteField(field)

      specs.push(new WithViewColor(this.id, Option(previous), color.toJSON()))
    }

    if (this.sort.isSome()) {
      const previous = this.sort.into(null)?.value
      const sort = this.sort.unwrap().deleteField(field)

      specs.push(new WithViewSort(this.id, Option(previous), sort.toJSON()))
    }

    if (this.widgets.isSome()) {
      const previous = this.widgets.into(null)
      const widgets = this.widgets.unwrap().map((w) => {
        const updated = w.deleteField(field.id.value)
        return updated.isSome() ? updated.unwrap() : w
      })

      specs.push(
        new WithViewWidgets(
          this.id,
          Option(previous),
          widgets.map((w) => w.toJSON()),
        ),
      )
    }

    return and(...specs)
  }

  toJSON(): IViewDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      type: this.type,
      isDefault: this.isDefault ?? undefined,
      option: this.option.into(null)?.toJSON(),
      filter: this.filter.into(null)?.toJSON(),
      color: this.color.into(null)?.toJSON(),
      sort: this.sort.into(null)?.toJSON(),
      aggregate: this.aggregate.into(null)?.toJSON(),
      fields: this.fields.into(null)?.toJSON(),
      widgets: this.widgets.into(undefined),
    }
  }
}
