import type { Option } from "@undb/domain"
import type { ISetViewFieldsDTO } from "../dto"
import { SetViewFieldsEvent } from "../events"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewFields(this: TableDo, dto: ISetViewFieldsDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)

  const spec = view.$setFieldsSpec(dto.fields)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewFieldsEvent(
      {
        tableId: this.id.value,
        viewId: view.id.value,
        previous: spec.unwrap().previous.into(null) ?? null,
        fields: view.fields.into(null)?.toJSON() ?? null,
      },
      this.spaceId,
    )
    this.addDomainEvent(event)
  }

  return spec
}
