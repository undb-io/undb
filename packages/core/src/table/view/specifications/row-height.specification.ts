import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { ViewRowHeight } from '../view-row-height.vo.js'
import type { ViewVO } from '../view.vo.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithRowHeight extends BaseViewSpecification {
  constructor(public readonly view: ViewVO, public readonly rowHeight: ViewRowHeight) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return this.view.rowHeight?.equals(this.rowHeight) ?? false
  }

  mutate(t: Table): Result<Table, string> {
    this.view.rowHeight = this.rowHeight
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.rowHeightEqual(this)
    return Ok(undefined)
  }
}
