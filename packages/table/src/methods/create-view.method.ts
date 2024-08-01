import { applyRules, Some, type Option } from "@undb/domain"
import { ViewCreatedEvent } from "../events/view-created.event"
import { GridView, type ICreateViewDTO } from "../modules"
import { ViewNameShouldBeUnique } from "../rules/view-name-should-be-unique.rule"
import { WithNewView, type TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function createViewMethod(this: TableDo, dto: ICreateViewDTO): Option<TableComositeSpecification> {
  const view = GridView.create(dto)
  const spec = new WithNewView(view)

  spec.mutate(this)

  const names = this.views.views.map((v) => v.name.value)
  applyRules(new ViewNameShouldBeUnique(names))

  const event = new ViewCreatedEvent({
    tableId: this.id.value,
    view: view.toJSON(),
  })
  this.addDomainEvent(event)

  return Some(spec)
}
