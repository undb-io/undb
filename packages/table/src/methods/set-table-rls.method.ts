import { Option, Some } from "@undb/domain"
import type { ISetTableRLSDTO } from "../dto"
import { TableRLSGroup } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import { WithTableRLS } from "../specifications/table-rls.specification"
import type { TableDo } from "../table.do"

export function setTableRLS(this: TableDo, dto: ISetTableRLSDTO): Option<TableComositeSpecification> {
  const rls = dto.rls ? TableRLSGroup.fromJSON(dto.rls) : null

  const spec = new WithTableRLS(this.rls, Option(rls))
  spec.mutate(this)

  return Some(spec)
}
