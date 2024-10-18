import type { Option } from "@undb/domain"
import type { ISetViewFilterDTO } from "../dto"
import { SetViewFilterEvent } from "../events"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewFilter(this: TableDo, dto: ISetViewFilterDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)

  const spec = view.$setFilterSpec(dto.filter)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewFilterEvent(
      {
        tableId: this.id.value,
        viewId: view.id.value,
        previous: spec.unwrap().prefiousFilter.into(null) ?? null,
        filter: view.filter.into(null)?.toJSON() ?? null,
      },
      this.spaceId,
    )
    this.addDomainEvent(event)
  }

  return spec
}
