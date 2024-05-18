import type { Option } from "@undb/domain"
import type { ISetViewSortDTO } from "../dto"
import { SetViewSortEvent } from "../events"
import { ViewIdVo } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewSort(this: TableDo, dto: ISetViewSortDTO): Option<TableComositeSpecification> {
  const viewId = dto.viewId ? new ViewIdVo(dto.viewId) : undefined
  const view = this.views.getViewById(viewId)

  const spec = view.$setSortSpec(dto.sort)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewSortEvent({
      tableId: this.id.value,
      viewId: view.id.value,
      previous: spec.unwrap().previous.into(null) ?? null,
      sort: view.sort.into(null)?.toJSON() ?? null,
    })
    this.addDomainEvent(event)
  }

  return spec
}
