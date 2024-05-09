import { Ok, type Result } from '@undb/domain'
import type { TableId } from '../table-id.vo'
import type { TableDo } from '../table.do'
import type { ITableSpecVisitor } from './table-visitor.interface'
import { TableComositeSpecification } from './table.composite-specification'

export class TableIdSpecification extends TableComositeSpecification {
  constructor(public readonly id: TableId) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    return t.id.equals(this.id)
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
