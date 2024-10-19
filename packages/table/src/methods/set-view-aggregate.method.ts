import type { Option } from "@undb/domain"
import type { ISetViewAggregateDTO } from "../dto"
import { SetViewAggregateEvent } from "../events"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewAggregate(this: TableDo, dto: ISetViewAggregateDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)

  const spec = view.$setAggregateSpec(dto.aggregate)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewAggregateEvent(
      {
        tableId: this.id.value,
        viewId: view.id.value,
        previous: spec.unwrap().previous.into(null) ?? null,
        aggregate: view.aggregate.into(null)?.value ?? null,
      },
      this.spaceId,
    )
    this.addDomainEvent(event)
  }

  return spec
}
