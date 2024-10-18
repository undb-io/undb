import { andOptions, None, Option, Some } from "@undb/domain"
import { FieldDeletedEvent } from "../events"
import type { IDeleteFieldDTO } from "../modules/schema/fields/dto/delete-field.dto"
import { FieldIdVo } from "../modules/schema/fields/field-id.vo"
import type { Field } from "../modules/schema/fields/field.type"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function deleteFieldMethod(this: TableDo, dto: IDeleteFieldDTO): [Field, Option<TableComositeSpecification>] {
  const field = this.schema.getFieldById(new FieldIdVo(dto.id)).expect("field not found")
  const deleteFieldSpec = this.schema.$deleteField(dto)
  const formDeleteFieldSpec = this.forms?.$deleteField(field)
  const viewDeleteFieldSpec = this.views.$deleteField(this, field)
  const rlsDeleteFieldSpec = this.rls.into(undefined)?.$deleteField(field)

  const spec = andOptions(
    //
    deleteFieldSpec,
    formDeleteFieldSpec ? Some(formDeleteFieldSpec) : None,
    viewDeleteFieldSpec,
    rlsDeleteFieldSpec ? rlsDeleteFieldSpec : None,
  ).unwrap()

  spec.mutate(this)

  const event = new FieldDeletedEvent(
    {
      tableId: this.id.value,
      field: field.toJSON(),
    },
    this.spaceId,
  )
  this.addDomainEvent(event)

  return [field, Some(spec)]
}
