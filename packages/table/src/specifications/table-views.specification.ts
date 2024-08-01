import { Ok, WontImplementException, type Result } from "@undb/domain"
import type { Views } from "../modules/views/views.vo"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class TableViewsSpecification extends TableComositeSpecification {
  constructor(public readonly views: Views) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(TableComositeSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.views = this.views
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withViews(this)
    return Ok(undefined)
  }
}
