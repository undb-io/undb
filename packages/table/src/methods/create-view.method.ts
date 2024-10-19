import { applyRules, Some, type Option } from "@undb/domain"
import { ViewCreatedEvent } from "../events/view-created.event"
import { type ICreateViewDTO, type View } from "../modules"
import { ViewFactory } from "../modules/views/view/view.factory"
import { ViewNameShouldBeUnique } from "../rules/view-name-should-be-unique.rule"
import { WithNewView, type TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function createViewMethod(
  this: TableDo,
  dto: ICreateViewDTO,
): { spec: Option<TableComositeSpecification>; view: View } {
  const view = ViewFactory.create(this, dto)
  const spec = new WithNewView(view)

  spec.mutate(this)

  const names = this.views.views.map((v) => v.name.value)
  applyRules(new ViewNameShouldBeUnique(names))

  const event = new ViewCreatedEvent(
    {
      tableId: this.id.value,
      view: view.toJSON(),
    },
    this.spaceId,
  )
  this.addDomainEvent(event)

  return { spec: Some(spec), view }
}
