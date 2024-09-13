import { type Option } from "@undb/domain"
import type { ISetFieldWidthDTO } from "../dto"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setFieldWidth(this: TableDo, dto: ISetFieldWidthDTO): Option<TableComositeSpecification> {
  const view = this.views.getViewById(dto.viewId)

  if (view.type !== "grid") {
    throw new Error("View type is not grid")
  }

  const spec = view.$setFieldWidthSpec(dto.field, dto.width)

  if (spec.isSome()) {
    spec.unwrap().mutate(this)
  }

  return spec
}
