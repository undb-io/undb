import { Some, type Option } from "@undb/domain"
import { FormVO, type ICreateFormDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"
import { WithNewFormSpecification } from "../specifications/table-forms.specification"

export function createFormMethod(this: TableDo, dto: ICreateFormDTO): Option<TableComositeSpecification> {
  const form = FormVO.create(this, dto)
  const spec = new WithNewFormSpecification(form)

  spec.mutate(this)

  // const event = new FormCreatedEvent({
  //   tableId: this.id.value,
  //   field: spec.field.toJSON(),
  // })
  // this.addDomainEvent(event)

  return Some(spec)
}
