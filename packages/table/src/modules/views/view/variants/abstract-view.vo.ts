import { None, Some, type Option } from '@undb/domain'
import { z } from 'zod'
import { WithViewFilter } from '../../../../specifications/table-view.specification'
import { Filter, filterGroup, type IRootFilter } from '../../../filters'
import { ViewIdVo, viewId, type ViewId } from '../view-id.vo'
import { ViewNameVo, viewName } from '../view-name.vo'
import type { ViewType } from '../view.type'

export const createBaseViewDTO = z.object({
  id: viewId.optional(),
  name: viewName,
})

export type ICreateBaseViewDTO = z.infer<typeof createBaseViewDTO>

export const baseViewDTO = z.object({
  id: viewId,
  name: viewName,
  filter: filterGroup.optional(),
})

export type IBaseViewDTO = z.infer<typeof baseViewDTO> & { filter?: IRootFilter }

export abstract class AbstractView {
  id!: ViewId
  name!: ViewNameVo
  filter: Option<Filter> = None

  abstract type: ViewType

  constructor(dto: IBaseViewDTO) {
    this.id = new ViewIdVo(dto.id)
    this.name = new ViewNameVo(dto.name)
    if (dto.filter) {
      this.setFilter(dto.filter)
    }
  }

  setFilter(filter: IRootFilter) {
    const filterVO = new Filter(filter)

    if (filterVO.isEmpty) {
      this.filter = None
    } else {
      this.filter = Some(filterVO)
    }
  }

  $setFilterSpec(filter: IRootFilter) {
    return new WithViewFilter(this.id, filter)
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name.value,
      type: this.type,
      filter: this.filter.into(null)?.toJSON(),
    }
  }
}
