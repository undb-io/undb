import { None, Option, Some, andOptions, applyRules } from "@undb/domain"
import { FieldCreatedEvent } from "../events"
import { type Field, type ICreateFieldDTO } from "../modules"
import { FieldFactory } from "../modules/schema/fields/field.factory"
import { FieldIdShouldBeUnique } from "../modules/schema/rules/field-id-should-be-unique.rule"
import { FieldNameShouldBeUnique } from "../modules/schema/rules/field-name-should-be-unique.rule"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function $createFieldSpec(this: TableDo, field: Field): Option<TableComositeSpecification> {
  const createFieldSpec = this.schema.$createField(field)
  const formAddFieldSpec = this.forms?.$addField(field)
  const viewAddFieldSpec = this.views.$addField(this, field)

  const spec = andOptions(
    Some(createFieldSpec),
    formAddFieldSpec ? Some(formAddFieldSpec) : None,
    viewAddFieldSpec,
  ).unwrap()
  spec.mutate(this)

  applyRules(new FieldNameShouldBeUnique(this.schema), new FieldIdShouldBeUnique(this.schema))

  const event = new FieldCreatedEvent(
    {
      tableId: this.id.value,
      field: createFieldSpec.field.toJSON(),
      views: this.views.toJSON(),
      forms: formAddFieldSpec?.forms.toJSON(),
    },
    this.spaceId,
  )
  this.addDomainEvent(event)

  return Some(spec)
}

export function createFieldMethod(this: TableDo, dto: ICreateFieldDTO): [Field, Option<TableComositeSpecification>] {
  const field = FieldFactory.create(this, dto)

  return [field, this.$createFieldSpec(field)]
}
