import type { Option } from "@undb/domain"
import type { ISetViewOptionDTO } from "../dto"
import { SetViewOptionEvent } from "../events"
import { ViewIdVo } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewOption(this: TableDo, dto: ISetViewOptionDTO): Option<TableComositeSpecification> {
  const viewId = dto.viewId ? new ViewIdVo(dto.viewId) : undefined
  const view = this.views.getViewById(viewId)

  const spec = view.$setOptionSpec(dto.option)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewOptionEvent({
      tableId: this.id.value,
      viewId: view.id.value,
      previous: spec.unwrap().previous.into(null) ?? null,
      option: view.option.into(null)?.toJSON() ?? null,
    })
    this.addDomainEvent(event)
  }

  return spec
}
