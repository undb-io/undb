import { applyRules, Some, type Option } from "@undb/domain"
import { FormVO, type IDuplicateFormDTO } from "../modules"
import { FormNameShouldBeUnique } from "../rules/form-name-should-be-unique.rule"
import type { TableComositeSpecification } from "../specifications"
import { WithNewFormSpecification } from "../specifications/table-forms.specification"
import type { TableDo } from "../table.do"

export function duplicateFormMethod(
  this: TableDo,
  dto: IDuplicateFormDTO,
): { spec: Option<TableComositeSpecification>; form: FormVO } {
  const form = this.forms?.getFormById(dto.id)
  if (!form) {
    throw new Error("Form not found")
  }
  const duplicated = form.duplicate(dto)
  const spec = new WithNewFormSpecification(duplicated)

  spec.mutate(this)

  const names = this.forms?.forms.map((f) => f.name) ?? []
  applyRules(new FormNameShouldBeUnique(names))

  // const event = new FormDuplicatedEvent({
  //   tableId: this.id.value,
  //   field: spec.field.toJSON(),
  // })
  // this.addDomainEvent(event)

  return { spec: Some(spec), form: duplicated }
}
