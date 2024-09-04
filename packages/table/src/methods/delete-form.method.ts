import { None, Some, type Option } from "@undb/domain"
import type { IDeleteTableFormDTO } from "../modules/forms/dto/delete-form.dto"
import { WithoutFormSpecification, type TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function deleteFormMethod(
  this: TableDo,
  { id: formId }: IDeleteTableFormDTO,
): Option<TableComositeSpecification> {
  const form = this.forms?.props.find((f) => f.id === formId)
  if (!form) return None

  const spec = new WithoutFormSpecification(formId)

  spec.mutate(this)

  // const event = new FormDeletedEvent({
  //   tableId: this.id.value,
  //   formId: form.id,
  // })
  // this.addDomainEvent(event)

  return Some(spec)
}
