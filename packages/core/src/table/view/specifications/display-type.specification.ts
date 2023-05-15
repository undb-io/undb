import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { IViewDisplayType } from '../view.type.js'
import type { ViewVO } from '../view.vo.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithDisplayType extends BaseViewSpecification {
  constructor(public readonly view: ViewVO, public readonly displayType: IViewDisplayType) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return this.view.displayType === this.displayType
  }

  mutate(t: Table): Result<Table, string> {
    this.view.displayType = this.displayType
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.displayTypeEqual(this)
    return Ok(undefined)
  }
}
