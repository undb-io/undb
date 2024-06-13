import type { Option } from "@undb/domain"
import type { IUpdateViewDTO } from "../dto"
import { ViewUpdatedEvent } from "../events"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function updateView(this: TableDo, dto: IUpdateViewDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)

  const spec = view.$update(dto)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new ViewUpdatedEvent({
      tableId: this.id.value,
      previous: spec.unwrap().previous.toJSON() ?? null,
      view: view?.toJSON() ?? null,
    })
    this.addDomainEvent(event)
  }

  return spec
}
