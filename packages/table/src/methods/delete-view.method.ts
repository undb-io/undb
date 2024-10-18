import { type Option } from "@undb/domain"
import type { IDeleteViewDTO } from "../dto/delete-view.dto"
import { ViewDeletedEvent } from "../events/view-deleted.event"
import { type TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function deleteViewMethod(this: TableDo, dto: IDeleteViewDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)
  if (view.isDefault) {
    throw new Error("Cannot delete default view")
  }

  const spec = view.$delete()

  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new ViewDeletedEvent(
      {
        tableId: this.id.value,
        viewId: view.id.value,
      },
      this.spaceId,
    )
    this.addDomainEvent(event)
  }

  return spec
}
