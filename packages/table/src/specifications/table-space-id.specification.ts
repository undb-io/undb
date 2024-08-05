import { Ok, type Result } from "@undb/domain"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class TableSpaceIdSpecification extends TableComositeSpecification {
  constructor(public readonly spaceId: string) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    return t.spaceId === this.spaceId
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.spaceId = this.spaceId
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withSpaceId(this)
    return Ok(undefined)
  }
}
