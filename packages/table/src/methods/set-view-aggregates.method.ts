import type { Option } from "@undb/domain"
import type { ISetViewAggregatesDTO } from "../dto"
import { SetViewAggregatesEvent } from "../events"
import { ViewIdVo } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewAggregates(this: TableDo, dto: ISetViewAggregatesDTO): Option<TableComositeSpecification> {
  const viewId = dto.viewId ? new ViewIdVo(dto.viewId) : undefined
  const view = this.views.getViewById(viewId)

  const spec = view.$setAggregateSpec(dto.aggregates)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewAggregatesEvent({
      tableId: this.id.value,
      viewId: view.id.value,
      previous: spec.unwrap().previous.into(null) ?? null,
      aggregates: view.aggregate.into(null)?.value ?? null,
    })
    this.addDomainEvent(event)
  }

  return spec
}
