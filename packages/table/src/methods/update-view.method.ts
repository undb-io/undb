import { applyRules, type Option } from "@undb/domain"
import type { IUpdateViewDTO } from "../dto"
import { ViewUpdatedEvent } from "../events"
import { ViewNameShouldBeUnique } from "../rules/view-name-should-be-unique.rule"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function updateView(this: TableDo, dto: IUpdateViewDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)

  const spec = view.$update(this, dto)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const names = this.views.views.map((v) => v.name.value)
    applyRules(new ViewNameShouldBeUnique(names))

    const event = new ViewUpdatedEvent(
      {
        tableId: this.id.value,
        previous: spec.unwrap().previous.toJSON() ?? null,
        view: view?.toJSON() ?? null,
      },
      this.spaceId,
    )
    this.addDomainEvent(event)
  }

  return spec
}
