import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IUpdateViewDTO } from "../../../../dto"
import {
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFields,
  WithViewFilter,
  WithViewOption,
  WithViewSort,
} from "../../../../specifications/table-view.specification"
import type { IViewDTO } from "../dto"
import { ViewAggregateVO, viewAggregate, type IViewAggregate } from "../view-aggregate/view-aggregate.vo"
import { ViewColor, viewColorGroup, type IRootViewColor } from "../view-color"
import { ViewFields, viewFields, type IViewFields } from "../view-fields"
import { ViewFilter, viewFilterGroup, type IRootViewFilter } from "../view-filter/view-filter.vo"
import { ViewIdVo, viewId, type ViewId } from "../view-id.vo"
import { ViewNameVo, viewName } from "../view-name.vo"
import { ViewOption, viewOption, type IViewOption } from "../view-option.vo"
import { ViewSort, viewSort, type IViewSort } from "../view-sort"
import type { ViewType } from "../view.type"

export const createBaseViewDTO = z.object({
  id: viewId.optional(),
  name: viewName,
  isDefault: z.boolean().optional(),
})

export type ICreateBaseViewDTO = z.infer<typeof createBaseViewDTO>

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

  abstract type: ViewType

  constructor(dto: IBaseViewDTO) {
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
      this.setFields(dto.fields)
    }
    if (dto.option) {
      this.setOption(dto.option)
    }
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

  abstract $update(input: IUpdateViewDTO): Option<WithView>

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

  setFields(fields: IViewFields) {
    this.fields = Some(new ViewFields(fields))
  }

  $setFieldsSpec(fields: IViewFields): Option<WithViewFields> {
    if (this.fields.mapOr(false, (f) => f.isEqual(fields))) {
      return None
    }

    const previous = this.fields.into(null)?.value
    return Some(new WithViewFields(this.id, Option(previous), fields))
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
    }
  }
}
