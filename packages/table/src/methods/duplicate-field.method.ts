import { andOptions, Option, Some } from "@undb/domain"
import { type IDuplicateFieldDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function duplicateFieldMethod(this: TableDo, dto: IDuplicateFieldDTO): Option<TableComositeSpecification> {
  const spec = this.schema.$duplicateField(dto)

  return andOptions(Some(spec), this.$createFieldSpec(spec.field))
}
