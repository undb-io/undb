import { andOptions, Option, Some } from "@undb/domain"
import { type Field, type IDuplicateFieldDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function duplicateFieldMethod(
  this: TableDo,
  dto: IDuplicateFieldDTO,
): [Field, Option<TableComositeSpecification>] {
  const spec = this.schema.$duplicateField(dto)
  const field = spec.field

  return [field, andOptions(this.$createFieldSpec(field), Some(spec))]
}
