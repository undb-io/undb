import { type Option } from "@undb/domain"
import type { ISetDefaultViewDTO } from "../dto"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setDefaultView(this: TableDo, dto: ISetDefaultViewDTO): Option<TableComositeSpecification> {
  const spec = this.views.$setDefaultView(this, dto)

  if (spec.isSome()) {
    spec.unwrap().mutate(this)
  }

  return spec
}
