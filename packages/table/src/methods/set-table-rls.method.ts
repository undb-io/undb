import { Option, Some } from "@undb/domain"
import type { ISetTableRLSDTO } from "../dto"
import { TableRLS, TableRLSGroup } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import { WithTableRLS } from "../specifications/table-rls.specification"
import type { TableDo } from "../table.do"

export function setTableRLS(this: TableDo, dto: ISetTableRLSDTO): Option<TableComositeSpecification> {
  const rls = dto.rls
    ? this.rls.unwrapOrElse(() => new TableRLSGroup([])).setRLS(TableRLS.fromJSON(dto.rls))
    : undefined

  const spec = new WithTableRLS(this.rls, Option(rls))
  spec.mutate(this)

  return Some(spec)
}
