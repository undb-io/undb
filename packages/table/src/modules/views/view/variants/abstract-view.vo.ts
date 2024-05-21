import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { WithViewColor, WithViewFilter, WithViewSort } from "../../../../specifications/table-view.specification"
import type { IViewDTO } from "../dto"
import { ViewColor, viewColorGroup, type IRootViewColor } from "../view-color"
import { ViewFilter, viewFilterGroup, type IRootViewFilter } from "../view-filter/view-filter.vo"
import { ViewIdVo, viewId, type ViewId } from "../view-id.vo"
import { ViewNameVo, viewName } from "../view-name.vo"
import { ViewSort, viewSort, type IViewSort } from "../view-sort"
import type { ViewType } from "../view.type"

export const createBaseViewDTO = z.object({
  id: viewId.optional(),
  name: viewName,
})

export type ICreateBaseViewDTO = z.infer<typeof createBaseViewDTO>

export const baseViewDTO = z.object({
  id: viewId,
  name: viewName,
  filter: viewFilterGroup.optional(),
  color: viewColorGroup.optional(),
  sort: viewSort.optional(),
})

export type IBaseViewDTO = z.infer<typeof baseViewDTO>

export abstract class AbstractView {
  id!: ViewId
  name!: ViewNameVo
  filter: Option<ViewFilter> = None
  color: Option<ViewColor> = None
  sort: Option<ViewSort> = None

  abstract type: ViewType

  constructor(dto: IBaseViewDTO) {
    this.id = new ViewIdVo(dto.id)
    this.name = new ViewNameVo(dto.name)
    if (dto.filter) {
      this.setFilter(dto.filter)
    }
    if (dto.color) {
      this.setColor(dto.color)
    }
    if (dto.sort) {
      this.setSort(dto.sort)
    }
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

  toJSON(): IViewDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      type: this.type,
      filter: this.filter.into(null)?.toJSON(),
      color: this.color.into(null)?.toJSON(),
      sort: this.sort.into(null)?.toJSON(),
    }
  }
}
