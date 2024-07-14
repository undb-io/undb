import { Option } from "@undb/domain"
import { type IDuplicateFieldDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function duplicateFieldMethod(this: TableDo, dto: IDuplicateFieldDTO): Option<TableComositeSpecification> {
  const field = this.schema.duplicateField(dto)

  return this.$createFieldSpec(field)
}
