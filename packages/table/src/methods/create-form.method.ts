import { applyRules, Some, type Option } from "@undb/domain"
import { FormVO, type ICreateFormDTO } from "../modules"
import { FormNameShouldBeUnique } from "../rules/form-name-should-be-unique.rule"
import type { TableComositeSpecification } from "../specifications"
import { WithNewFormSpecification } from "../specifications/table-forms.specification"
import type { TableDo } from "../table.do"

export function createFormMethod(
  this: TableDo,
  dto: ICreateFormDTO,
): { spec: Option<TableComositeSpecification>; form: FormVO } {
  const form = FormVO.create(this, dto)
  const spec = new WithNewFormSpecification(form)

  spec.mutate(this)

  const names = this.forms?.forms.map((f) => f.name) ?? []
  applyRules(new FormNameShouldBeUnique(names))

  // const event = new FormCreatedEvent({
  //   tableId: this.id.value,
  //   field: spec.field.toJSON(),
  // })
  // this.addDomainEvent(event)

  return { spec: Some(spec), form }
}
