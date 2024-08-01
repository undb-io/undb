import { andOptions, None, Option, Some } from "@undb/domain"
import { FieldDeletedEvent } from "../events"
import { type Field, type IDeleteFieldDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function deleteFieldMethod(this: TableDo, dto: IDeleteFieldDTO): [Field, Option<TableComositeSpecification>] {
  const deleteFieldSpec = this.schema.$deleteField(dto)
  const field = deleteFieldSpec.field
  const formDeleteFieldSpec = this.forms?.$deleteField(field)
  const viewDeleteFieldSpec = this.views.$deleteField(field)
  const rlsDeleteFieldSpec = this.rls.into(undefined)?.$deleteField(field)

  const spec = andOptions(
    //
    Some(deleteFieldSpec),
    formDeleteFieldSpec ? Some(formDeleteFieldSpec) : None,
    viewDeleteFieldSpec,
    rlsDeleteFieldSpec ? rlsDeleteFieldSpec : None,
  ).unwrap()

  spec.mutate(this)

  const event = new FieldDeletedEvent({
    tableId: this.id.value,
    field: field.toJSON(),
  })
  this.addDomainEvent(event)

  return [deleteFieldSpec.field, Some(spec)]
}
