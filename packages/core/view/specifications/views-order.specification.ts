import { CompositeSpecification } from '@egodb/domain'
import { Ok, Result } from 'oxide.ts'
import { ITableSpecVisitor } from '../../specifications'
import { Table } from '../../table'
import { ViewsOrder } from '../views-order.vo'

export class WithViewsOrder extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly order: ViewsOrder) {
    super()
  }
  static fromArray(ids: string[]): WithViewsOrder {
    return new this(ViewsOrder.fromArray(ids))
  }
  static empty() {
    return new this(ViewsOrder.empty())
  }
  isSatisfiedBy(t: Table): boolean {
    return this.order.equals(t.viewsOrder)
  }
  mutate(t: Table): Result<Table, string> {
    t.viewsOrder = this.order
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.viewsOrderEqual(this)
    return Ok(undefined)
  }
}
