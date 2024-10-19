import { None, Some, type Option } from "@undb/domain"
import type { ISetTableFormDTO } from "../dto"
import { SetTableFormEvent } from "../events"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setTableForm(this: TableDo, dto: ISetTableFormDTO): Option<TableComositeSpecification> {
  const forms = this.forms
  const spec = forms?.$setForm(dto.form)
  if (!spec) return None
  spec.mutate(this)

  const event = new SetTableFormEvent(
    {
      tableId: this.id.value,
      previous: spec.previous ?? null,
      form: spec.form.toJSON(),
    },
    this.spaceId,
  )
  this.addDomainEvent(event)

  return Some(spec)
}
