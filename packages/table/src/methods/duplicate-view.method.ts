import { applyRules, type Option } from "@undb/domain"
import type { IDuplicateViewDTO } from "../dto/duplicate-view.dto"
import { ViewCreatedEvent } from "../events/view-created.event"
import type { View } from "../modules"
import { ViewNameShouldBeUnique } from "../rules/view-name-should-be-unique.rule"
import { type TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function duplicateViewMethod(
  this: TableDo,
  dto: IDuplicateViewDTO,
): { spec: Option<TableComositeSpecification>; view: View } {
  const view = this.views.getViewById(dto.viewId)
  const spec = view.$duplicate(this, dto)

  const names = this.views.views.map((v) => v.name.value)
  applyRules(new ViewNameShouldBeUnique(names))

  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new ViewCreatedEvent(
      {
        tableId: this.id.value,
        view: view.toJSON(),
      },
      this.spaceId,
    )
    this.addDomainEvent(event)
  }

  return { spec, view }
}
