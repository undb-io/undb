import { Some, type Option } from "@undb/domain"
import { type ICreateFieldDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function createFieldMethod(this: TableDo, dto: ICreateFieldDTO): Option<TableComositeSpecification> {
  const spec = this.schema.$createField(dto)

  spec.mutate(this)

  return Some(spec)
}
