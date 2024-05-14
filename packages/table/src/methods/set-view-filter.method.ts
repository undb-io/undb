import type { ISetViewFilterDTO } from "../dto"
import { ViewIdVo } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewFilter(this: TableDo, dto: ISetViewFilterDTO): TableComositeSpecification {
  const viewId = dto.viewId ? new ViewIdVo(dto.viewId) : undefined
  const view = this.views.getViewById(viewId)

  const spec = view.$setFilterSpec(dto.filter)
  spec.mutate(this)

  return spec
}
