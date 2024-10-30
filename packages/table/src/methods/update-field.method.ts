import { Option, Some, applyRules } from "@undb/domain"
import { FieldUpdatedEvent } from "../events"
import { type IUpdateFieldDTO } from "../modules"
import { FieldIdShouldBeUnique } from "../modules/schema/rules/field-id-should-be-unique.rule"
import { FieldNameShouldBeUnique } from "../modules/schema/rules/field-name-should-be-unique.rule"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function updateFieldMethod(this: TableDo, dto: IUpdateFieldDTO): Option<TableComositeSpecification> {
  const spec = this.schema.$updateField(this, dto)
  // TODO: update form
  spec.mutate(this)

  applyRules(new FieldNameShouldBeUnique(this.schema), new FieldIdShouldBeUnique(this.schema))

  const event = new FieldUpdatedEvent(
    {
      tableId: this.id.value,
      field: spec.field.toJSON(),
      previous: spec.previous.toJSON(),
    },
    this.spaceId,
  )
  this.addDomainEvent(event)

  return Some(spec)
}
