import type { Option } from "@undb/domain"
import type { ISetViewColorDTO } from "../dto"
import { SetViewColorEvent } from "../events"
import { ViewIdVo } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewColor(this: TableDo, dto: ISetViewColorDTO): Option<TableComositeSpecification> {
  const viewId = dto.viewId ? new ViewIdVo(dto.viewId) : undefined
  const view = this.views.getViewById(viewId)

  const spec = view.$setColorSpec(dto.color)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewColorEvent({
      tableId: this.id.value,
      viewId: view.id.value,
      previous: spec.unwrap().prefiousColor.into(null) ?? null,
      color: view.color.into(null)?.toJSON() ?? null,
    })
    this.addDomainEvent(event)
  }

  return spec
}
