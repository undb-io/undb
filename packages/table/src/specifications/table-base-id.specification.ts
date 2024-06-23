import { Ok, type Result } from "@undb/domain"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class TableBaseIdSpecification extends TableComositeSpecification {
  constructor(public readonly baseId: string) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    return t.baseId === this.baseId
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.baseId = this.baseId
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withBaseId(this)
    return Ok(undefined)
  }
}
