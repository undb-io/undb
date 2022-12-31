import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { View } from '../view'
import type { IViewDisplayType } from '../view.type'

export class WithDisplayType extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: View, public readonly displayType: IViewDisplayType) {
    super()
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
