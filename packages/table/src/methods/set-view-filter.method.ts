import type { ISetViewFilterDTO } from "../dto"
import { SetViewFilterEvent } from "../events"
import { ViewIdVo } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewFilter(this: TableDo, dto: ISetViewFilterDTO): TableComositeSpecification {
  const viewId = dto.viewId ? new ViewIdVo(dto.viewId) : undefined
  const view = this.views.getViewById(viewId)

  const spec = view.$setFilterSpec(dto.filter)
  spec.mutate(this)

  const event = new SetViewFilterEvent({
    tableId: this.id.value,
    viewId: view.id.value,
    filter: view.filter.unwrap().toJSON(),
  })
  this.addDomainEvent(event)

  return spec
}
