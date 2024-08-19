import { Ok, type Result } from "@undb/domain"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class DuplicatedTableSpecification extends TableComositeSpecification {
  constructor(
    public readonly originalTable: TableDo,
    public readonly duplicatedTable: TableDo,
    public readonly includeData: boolean,
    public readonly isSameSpace: boolean,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withDuplicatedTable(this)
    return Ok(undefined)
  }
}
