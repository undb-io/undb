import { andOptions, None, Option, Some } from "@undb/domain"
import { FieldDeletedEvent } from "../events"
import { type IDeleteFieldDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function deleteFieldMethod(this: TableDo, dto: IDeleteFieldDTO): Option<TableComositeSpecification> {
  const deleteFieldSpec = this.schema.$deleteField(dto)
  const formDeleteFieldSpec = this.forms?.$deleteField(deleteFieldSpec.field)
  const viewDeleteFieldSpec = this.views.$deleteField(deleteFieldSpec.field)

  const spec = andOptions(
    //
    Some(deleteFieldSpec),
    formDeleteFieldSpec ? Some(formDeleteFieldSpec) : None,
    viewDeleteFieldSpec,
  ).unwrap()

  spec.mutate(this)

  const event = new FieldDeletedEvent({
    tableId: this.id.value,
    field: deleteFieldSpec.field.toJSON(),
  })
  this.addDomainEvent(event)

  return Some(spec)
}
