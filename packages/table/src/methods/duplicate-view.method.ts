import { type Option } from "@undb/domain"
import type { IDuplicateViewDTO } from "../dto/duplicate-view.dto"
import { ViewCreatedEvent } from "../events/view-created.event"
import { type TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function duplicateViewMethod(this: TableDo, dto: IDuplicateViewDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)
  const spec = view.$duplicate()

  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new ViewCreatedEvent({
      tableId: this.id.value,
      view: view.toJSON(),
    })
    this.addDomainEvent(event)
  }

  return spec
}
