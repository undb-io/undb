import { Ok, type Result } from '@undb/domain'
import type { TableNameVo } from '../table-name.vo'
import type { TableDo } from '../table.do'
import type { ITableSpecVisitor } from './table-visitor.interface'
import { TableComositeSpecification } from './table.composite-specification'

export class TableNameSpecification extends TableComositeSpecification {
  constructor(public readonly name: TableNameVo) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    return t.name.equals(this.name)
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.name = this.name
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withName(this)
    return Ok(undefined)
  }
}
